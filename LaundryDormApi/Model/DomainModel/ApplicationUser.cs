using Microsoft.AspNetCore.Identity;

namespace LaundryDormApi.Model.DomainModel
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }

        // these are properties identity dont have by default that we are creating here
        //then we create a view model since this one is already a domain model after migration
    }
}
