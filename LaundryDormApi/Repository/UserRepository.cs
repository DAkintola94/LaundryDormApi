using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.Repository
{
    public class UserRepository  : IUserRepository
    {
        private readonly LaundryDormAuthContext _authContext;

        public UserRepository(LaundryDormAuthContext authContext)
        {
            _authContext = authContext;
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllUsers(string? mailFilter = null, string? mailQuery = null,
            string? firstNameFilter = null, string? firstNameQuery = null,
            string? lastNameFilter = null, string? lastNameQuery = null,
            CancellationToken cancellationToken = default,
            int pageNumber = 1, int pageSize = 50,
            string? sortBy = null, bool isAscending = true)
        {
            var getUsers = _authContext.Users.Where(x => !(x.Email == "sysadmin@test.com")).AsQueryable(); 

                                                    //Excluding the user with that email from the list
                                                                                                 //as queryable returns IQuerable<T>
                                                                                                 //which allows us to build up our query with additional filters, sort, etc

            //filtering
            if(!string.IsNullOrEmpty(mailFilter) && !string.IsNullOrEmpty(mailQuery))
            {
                if (mailFilter.Contains("Email", StringComparison.OrdinalIgnoreCase))
                {
                    getUsers = getUsers.Where(x => x.Email != null
                    && x.Email.Contains(mailQuery));
                }
            }

            else if (!string.IsNullOrEmpty(firstNameFilter) && !string.IsNullOrEmpty(firstNameQuery))
            {
                if (firstNameFilter.Contains("FirstName", StringComparison.OrdinalIgnoreCase))
                {
                    getUsers = getUsers.Where(x => x.FirstName != null
                    && x.FirstName.Contains(firstNameQuery));
                }
            }

            else if (!string.IsNullOrEmpty(lastNameFilter) && !string.IsNullOrEmpty(lastNameQuery))
            {
                if(lastNameFilter.Contains("LastName", StringComparison.OrdinalIgnoreCase))
                {
                    getUsers = getUsers.Where(x => x.LastName != null
                    && x.LastName.Contains(lastNameQuery));
                }
            }

            //sorting

            if (!string.IsNullOrEmpty(sortBy))
            {
                if(sortBy.Contains("Email", StringComparison.OrdinalIgnoreCase))
                {
                    getUsers = isAscending ?
                        getUsers.OrderBy(asc => asc.Email) :
                        getUsers.OrderByDescending(desc => desc.Email);
                }
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                if(sortBy.Contains("FirstName", StringComparison.OrdinalIgnoreCase))
                {
                    getUsers = isAscending ?
                        getUsers.OrderBy(asc => asc.FirstName) :
                        getUsers.OrderByDescending(desc => desc.FirstName);
                }
            }

            if (!string.IsNullOrEmpty(sortBy))
            {
                if(sortBy.Contains("LastName", StringComparison.OrdinalIgnoreCase))
                {
                    getUsers = isAscending ?
                        getUsers.OrderBy(x => x.LastName) :
                        getUsers.OrderByDescending(x => x.LastName);
                }
            }

            int skipResult = (pageNumber - 1) * pageSize;

            return await getUsers.Skip(skipResult).Take(pageSize).ToListAsync(cancellationToken);
        }


        public async Task<ApplicationUser?> GetUserById(string idValue, CancellationToken cancellationToken  = default)
        {
            return await _authContext.Users.Where(x => !(x.Email == "sysadmin@test.com") //Excluding the user with that email from the list
            && x.Id != null
            && x.Id == idValue).FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<ApplicationUser?> DeleteUser(string idValue, CancellationToken cancellationToken = default)
        {

            var userById = await _authContext.Users.Where(x => !(x.Email == "sysadmin@test.com") //Excluding the user with that email from the list
            && x.Id != null
            && x.Id == idValue).FirstOrDefaultAsync(cancellationToken);

            if(userById != null)
            {
                 _authContext.Remove(userById);
                await _authContext.SaveChangesAsync(cancellationToken);
                return userById;
            }

            return null;
        } 
    }
}
