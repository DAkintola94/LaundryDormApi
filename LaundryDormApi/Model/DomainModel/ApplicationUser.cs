using Microsoft.AspNetCore.Identity;

namespace LaundryDormApi.Model.DomainModel
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
