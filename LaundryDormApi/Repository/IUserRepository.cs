using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IUserRepository
    {
        Task<IEnumerable<ApplicationUser>> GetAllUsers(string? mailFilter = null, string? mailQuery = null,
            string? firstNameFilter = null, string? firstNameQuery = null,
            string? lastNameFilter = null, string? lastNameQuery = null,
            int pageNumber = 1, int pageSize = 50,
            string? sortBy = null, bool isAscending = true);
        Task<ApplicationUser?> GetUserById(string idValue);
        Task<ApplicationUser> DeleteUser(string idValue);
    }
}
