using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaundryDormApi.Model.ViewModel
{
    public class ImageViewModel
    {

        [Required]
        public string FileName { get; set; }

        [Required]
        public IFormFile File { get; set; }

        public string? FileDescription { get; set; }

    }
}
