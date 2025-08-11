using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using System.IO;
using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace LaundryDormApi.Repository
{
    public class LocalImageRepository : IImageRepository
    {
        private readonly LaundryDormDbContext _context;

        //IWebHostEnvironment helps your app know where it is running,like the root folder of your project on the server or your local machine.
        //It doesn’t create folders by itself, but it gives you the path (like a map) so you can create folders or save files in the right place relative to your app.
        private readonly IWebHostEnvironment _webHostEnvironment;

        
        private readonly IHttpContextAccessor _httpContextAccessor;
        // Gives access to the current web request details,
        // so we can build the full URL for the uploaded image.


        public LocalImageRepository(LaundryDormDbContext context, IWebHostEnvironment webHostEnvironment
            ,IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }


        /// <summary>
        /// Uploads an image file to the local server folder and saves its URL path to the database.
        /// </summary>
        /// <param name="image">The image model containing the file, name, and extension information.</param>
        /// <returns>The saved <see cref="ImageModel"/> with the updated ImagePath pointing to the image URL.</returns>
        /// <remarks>
        /// The method builds the local file path by combining the app's root folder, a "ServerImages" folder,
        /// and the image file name with its extension. It then saves the physical image file to this path.
        /// Afterwards, it constructs the URL path based on the current HTTP request details to store in the database.
        /// Note: The actual image file is saved on the server; the database stores only the URL path.
        /// </remarks>
        public async Task<ImageModel> Upload(ImageModel image, CancellationToken cancellationToken = default)
        {

            // Here, we create the full local path to save the image by combining:
            // 1. The root folder of the app (_webHostEnvironment.ContentRootPath),
            // 2. The folder named "ServerImages" where we want to store images,
            // 3. And the filename made up of the image’s name plus its extension.
            // This way, the image will be saved with the correct name inside the "ServerImages" folder.
            var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath,
                "ServerImages", $"{image.ImageName}{image.ImageExtension}");

            //uploads the image to the local path (images folder)

            using var stream = new FileStream(localFilePath, FileMode.Create);

            await image.ImageFile.CopyToAsync(stream, cancellationToken);

            var urlFilePath = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{image.ImageName}{image.ImageExtension}";

            image.ImagePath = urlFilePath; //Its the url path that we are saving in the database. Not the picture itself

            _context.Image.Add(image); //The url path for the location of the image in our server
            await _context.SaveChangesAsync(cancellationToken);
            return image;
        }


    }
}
