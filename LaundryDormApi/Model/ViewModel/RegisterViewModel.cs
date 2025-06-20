using System.ComponentModel.DataAnnotations;

namespace LaundryDormApi.Model.ViewModel
{
    public class RegisterViewModel
    {
        [Required]
        public string UserAddress { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }

        [Required]
        public string UserFirstName { get; set; }
        [Required]
        public string UserLastName { get; set; }
        [Required]
        public string PhoneNumber { get; set; }

    }
}
