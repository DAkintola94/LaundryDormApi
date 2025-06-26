using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.Repository
{
    public class UpdateCountRepository : IUpdateCountRepository
    {
        private readonly LaundryDormDbContext _context;

        public UpdateCountRepository(LaundryDormDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UpdateCountModel>> GetAllCount()
        {
            return await _context.UpdatedLaundryCount.Take(50).ToListAsync();
        }

        public async Task<UpdateCountModel> UpdateCount(int? countValue)
        {
            UpdateCountModel countModel = new UpdateCountModel
            {
                AmountOfCount = countValue
            };
                _context.Update(countModel);
                await _context.SaveChangesAsync();
                return countModel;
        }

        public async Task<int?> GetCountNumber()
        {
            //select to get/query a specific item from database
            //then first or default to get the first value, regardless if we are returning a list or not

            var countFromDb = 
                await _context.UpdatedLaundryCount.Select(x => x.AmountOfCount).FirstOrDefaultAsync(); 
            if(countFromDb!= null)
            {
                return countFromDb;
            }

            return null;
        }

    }
}
