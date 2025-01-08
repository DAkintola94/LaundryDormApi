using System.ComponentModel.DataAnnotations.Schema;

namespace LaundryDormApi.Model.DomainModel
{
    public class ImageModel
    {
        public Guid ImageId { get; set; }
        public string ImageName { get; set; }
        public string? ImageDescription { get; set; }

        public string ImageExtension { get; set; }

        public long? ImageSizeInBytes { get; set; }

        public string? ImagePath { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }

    }
}
