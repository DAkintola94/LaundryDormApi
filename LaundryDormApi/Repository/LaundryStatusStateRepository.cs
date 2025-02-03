using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.Repository
{
    public class LaundryStatusStateRepository : ILaundryStatusStateRepository
    {
        private readonly LaundryDormDbContext _context;
        public LaundryStatusStateRepository(LaundryDormDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LaundryStatusState>> GetAllStatus()
        {
            return await _context.LaundryStatus.Take(50).ToListAsync();
        }

    }
}
