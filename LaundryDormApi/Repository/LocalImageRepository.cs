using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using System.IO;
using System.Threading.Tasks;

namespace LaundryDormApi.Repository
{
    public class LocalImageRepository : IImageRepository
    {
        private readonly LaundryDormDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public LocalImageRepository(LaundryDormDbContext context, IWebHostEnvironment webHostEnvironment
            ,IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ImageModel> Upload(ImageModel image)
        {
            var localFilePath = Path.Combine(_webHostEnvironment.ContentRootPath,
                "ServerImages", $"{image.ImageName}{image.ImageExtension}");

            //uploads the image to the local path (images folder)
            using var stream = new FileStream(localFilePath, FileMode.Create);
            await image.ImageFile.CopyToAsync(stream);

            var urlFilePath = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}{_httpContextAccessor.HttpContext.Request.PathBase}/Images/{image.ImageName}{image.ImageExtension}";

            image.ImagePath = urlFilePath;

            _context.Image.Add(image);
            await _context.SaveChangesAsync();
            return image;
        }

    }
}
