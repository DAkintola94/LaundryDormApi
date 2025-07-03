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

        public async Task<IEnumerable<AdviceSet>> GetAllAdvice()
        {
            try
            {
                var getAdviceFromDb = await _context.Advice
                .Include(c => c.CategoryModel)
                .Take(50).ToListAsync();

                return getAdviceFromDb;
            } catch(Exception ex)

            {
                throw new Exception($"An error occured: {ex}");
                //We dont have to return or throw anything outside the try catch scope because when exception is thrown
                //the method execution is immediately stopped. Whole point with return in the first place
            }
            
        }

        public async Task<AdviceSet?> GetAdviceById(int id)
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
