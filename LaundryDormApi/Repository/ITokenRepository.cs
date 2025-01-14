using LaundryDormApi.Model.DomainModel;
using Microsoft.AspNetCore.Identity;

namespace LaundryDormApi.Repository
{
    public interface ITokenRepository
    {
        string CreateJWTToken(ApplicationUser user, List<string> roles);

    }
}
