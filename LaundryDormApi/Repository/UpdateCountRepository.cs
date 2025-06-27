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

        /// <summary>
        /// Since Task can work with any datatype, we are working with a custom model object
        /// Getting the int value from the database
        /// <param name="countValue"> The int value that the parameter takes from the laundry controller.
        /// The int value is affected by what the loop has counted </param>
        /// With dbcontext inheritence and variable setup 
        /// We can using different inbuildt methods like Where, Select, Any, FirstOrDefault, etc to query things from the database with the help of Entity Framework
        /// </summary>
        /// <returns> Returns an object variable in the end.</returns>
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

        /// <summary>
        /// Since Task can work with any datatype, we are working with int
        /// Getting the int value from the database
        /// Getting a specific value from the database with the use of Select
        /// With dbcontext inheritence and variable setup 
        /// We can using different inbuildt methods like Where, Select, Any, FirstOrDefault, etc to query things from the database with the help of Entity Framework
        /// </summary>
        /// <returns> Return null if we dont return int value in the if statement.</returns>
        public async Task<int?> GetCountNumber()
        {
           
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
