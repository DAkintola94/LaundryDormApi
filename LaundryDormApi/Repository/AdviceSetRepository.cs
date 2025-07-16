using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.Repository
{
    public class AdviceSetRepository : IAdviceSetRepository
    {
        private readonly LaundryDormDbContext _context;
        public AdviceSetRepository(LaundryDormDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AdviceSet>> GetAllAdvice(string? nameFilter = null, string? nameQuery = null
            ,string? emailFilter = null, string? emailQuery = null,
            string? categoryFilter = null, string? categoryQuery = null,
            string? dateFilter = null, string? dateQuery = null,
            string? sortBy = null, bool isAscending = true,
            int pageNumber = 1, int pageSize = 50)
        {
            
            
           var getAdviceFromDb = _context.Advice
            .Include(c => c.CategoryModel) //remember, include is same as innerjoin in SQL 
            .AsQueryable();

            //filtering
            if(!string.IsNullOrEmpty(nameFilter) && !string.IsNullOrEmpty(nameQuery)) //filter the json, then the content inside the json
            {
                if (nameFilter.Contains("PosterName", StringComparison.OrdinalIgnoreCase))
                {
                    getAdviceFromDb = getAdviceFromDb.Where(x => x.PosterName.Contains(nameQuery));
                }
            }

            else if(!string.IsNullOrEmpty(emailFilter) && !string.IsNullOrEmpty(emailQuery))
            {
                if (emailFilter.Contains("Email"))
                {
                    getAdviceFromDb = getAdviceFromDb.Where(x => x.Email.Contains(emailQuery));
                }
            }

            else if (!string.IsNullOrEmpty(categoryFilter) && !string.IsNullOrEmpty(categoryQuery))
            {
                if (categoryFilter.Contains("CategoryName", StringComparison.OrdinalIgnoreCase))
                {
                    getAdviceFromDb = getAdviceFromDb.Where(x => x.CategoryModel != null 
                    && x.CategoryModel.CategoryName != null
                    && x.CategoryModel.CategoryName.Contains(categoryQuery)
                    );
                }
            }

            else if(!string.IsNullOrEmpty(dateFilter) && !string.IsNullOrEmpty(dateQuery))
            {
                if(dateFilter.Equals("Date", StringComparison.OrdinalIgnoreCase))
                {
                    if (DateOnly.TryParse(dateFilter, out var dateValue)) //parsing the string dateFilter into a DateOnly variable, and making it a variable called dateValue 
                    {
                        getAdviceFromDb = getAdviceFromDb.Where(x => x.Date == dateValue);
                    }
                }
            }

            //sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy.Contains("PosterName", StringComparison.OrdinalIgnoreCase))
                {
                    getAdviceFromDb = isAscending ?
                        getAdviceFromDb.OrderBy(asc => asc.PosterName) :            //ternary condition for checking ascending boolean, else.
                        getAdviceFromDb.OrderByDescending(desc => desc.PosterName);
                }
            }

            else if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy.Contains("Email", StringComparison.OrdinalIgnoreCase))
                {
                    getAdviceFromDb = isAscending ?
                        getAdviceFromDb.OrderBy(asc => asc.Email) :
                        getAdviceFromDb.OrderByDescending(desc => desc.Email);
                }
            }

            else if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy.Equals("Date", StringComparison.OrdinalIgnoreCase))
                {
                    getAdviceFromDb = isAscending ?
                        getAdviceFromDb.OrderBy(asc => asc.Date) :
                        getAdviceFromDb.OrderByDescending(desc => desc.Date);
                }
            }

            else if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy.Contains("CategoryName", StringComparison.OrdinalIgnoreCase))
                {
                    getAdviceFromDb = isAscending ?
                        getAdviceFromDb.OrderBy(asc => asc.CategoryModel != null ? asc.CategoryModel.CategoryName : string.Empty)
                        : getAdviceFromDb.OrderByDescending(desc => desc.CategoryModel != null ? desc.CategoryModel.CategoryName : string.Empty);
                }
            }

            int skipResult = (pageNumber - 1) * pageSize;

            return await getAdviceFromDb.Skip(skipResult).Take(pageSize).ToListAsync(); 
            //by returning at the end, we can apply multiple filters and sort in sequences, and get all the values at last
        }

        public async Task<AdviceSet?> GetAdviceById(int id) //getting a single post by its single PK id. No reason for query logic!
        {
            return await _context.Advice
                .Include(c => c.CategoryModel)
                .Where(x => x.PosterId == id)
                .FirstOrDefaultAsync();
        }

        public async Task<AdviceSet> DeleteAdviceById(int id)
        {
            var adviceIdFromDb = await _context.Advice
                .Include(c => c.CategoryModel)
                .Where(x => x.PosterId == id).FirstOrDefaultAsync();

            if(adviceIdFromDb != null)
            {
                _context.Advice.Remove(adviceIdFromDb);
                await _context.SaveChangesAsync();
                return adviceIdFromDb;
            }

            throw new KeyNotFoundException($"An error occurred, poster id: {id} could not be found "); 
            //You can throw an error instead of returning anything (null)
        }

        public async Task<AdviceSet> InsertAdvice(AdviceSet adviceSet)
        {
            if(adviceSet!= null)
            {
                await _context.Advice.AddAsync(adviceSet);
                await _context.SaveChangesAsync();
                return adviceSet;
            }

            throw new KeyNotFoundException($"An error occurred, {adviceSet} could not be added into the database");
        }

        public async Task<AdviceSet> UpdateAdvice(AdviceSet adviceSet)
        {
            if(adviceSet != null)
            { 
                 _context.Advice.Update(adviceSet);
                 await _context.SaveChangesAsync();
                 return adviceSet;
            }

            throw new KeyNotFoundException($"An error occurred when trying to update {adviceSet}");
        }


    }
}
