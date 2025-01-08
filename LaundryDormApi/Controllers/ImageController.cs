using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LaundryDormApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IImageRepository _imageRepository;
        public ImageController(IImageRepository imageRepository)
        {
            _imageRepository = imageRepository;
        }

        [HttpPost]
        [Route("ImageUpload")]
        public async Task<IActionResult> ImageUpload([FromForm] ImageViewModel imageViewModel)
        {
            ImageValidationRequest(imageViewModel);

            if(ModelState.IsValid)
            {
                ImageModel imageDomain = new ImageModel
                {
                    ImageFile = imageViewModel.File,
                    ImageName = imageViewModel.FileName,
                    ImageExtension = Path.GetExtension(imageViewModel.File.FileName),
                    ImageSizeInBytes = imageViewModel.File.Length, //simply checking the length of the file
                    ImageDescription = imageViewModel.FileDescription,

                };
                await _imageRepository.Upload(imageDomain);
                return Ok(imageDomain);
            }

            return BadRequest(ModelState);
        }


        private void ImageValidationRequest (ImageViewModel imageRequest)
        {
            var allowedExtensions = new[] {".jpg", ".jpeg", ".png", ".gif" }; //an array of allowed extensions (name of files)
            if(!allowedExtensions.Contains(Path.GetExtension(imageRequest.File.FileName)))
            {
                ModelState.AddModelError("File", "Invalid file type. Only .jpg, .jpeg, .png, .gif file types are allowed");
            }

            if(imageRequest.File.Length > 10485760)
            {
                ModelState.AddModelError("File", "File size is too large. Maximum file size is 10MB");
            }
        }

    }
}
