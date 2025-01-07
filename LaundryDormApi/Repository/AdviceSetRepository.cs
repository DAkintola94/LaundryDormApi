using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.Repository
{
    public class AdviceSetRepository : IAdviceSetRepository
    {
        private readonly ApplicationDbContext _context;
        public AdviceSetRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AdviceSet>> GetAllAdvice()
        {
            var getAdviceFromDb = await _context.Advice.Take(50).ToListAsync();
            return getAdviceFromDb;
        }

        public async Task<AdviceSet?> GetAdviceById(int id)
        {
            return await _context.Advice.Where(x => x.PosterId == id).FirstOrDefaultAsync();
        }

        public async Task<AdviceSet?> DeleteAdviceById(int id)
        {
            var adviceIdFromDb = await _context.Advice.Where(x => x.PosterId == id).FirstOrDefaultAsync();
            if(adviceIdFromDb != null)
            {
                _context.Advice.Remove(adviceIdFromDb);
                await _context.SaveChangesAsync();
                return adviceIdFromDb;
            }

            return null;
        }

        public async Task<AdviceSet?> InsertAdvice(AdviceSet adviceSet)
        {
            if(adviceSet!= null)
            {
                await _context.Advice.AddAsync(adviceSet);
                await _context.SaveChangesAsync();
                return adviceSet;
            }

            return null;
        }

        public async Task<AdviceSet?> UpdateAdvice(AdviceSet adviceSet)
        {
            if(adviceSet != null)
            { 
                 _context.Advice.Update(adviceSet);
                 await _context.SaveChangesAsync();
                 return adviceSet;
            }

            return null;
        }


    }
}
