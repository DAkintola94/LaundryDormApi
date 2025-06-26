using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.Repository
{
    public class LaundrySessionRepository : ILaundrySession
    {
        private readonly LaundryDormDbContext _context;
        public LaundrySessionRepository(LaundryDormDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<LaundrySession>> GetAllSession()
        {
            return await _context.Laundry
                .Include(ls => ls.LaundryStatus)
                .Include(m => m.Machine)
                .Include(tp => tp.TimePeriod)
                .ToListAsync();
        }

        public async Task<LaundrySession?> GetSessionById(int id)
        {
            return await _context.Laundry
                .Include(ls => ls.LaundryStatus)
                .Include(m => m.Machine)
                .Include(tp => tp.TimePeriod)
                .Where(x => x.LaundrySessionId == id).FirstOrDefaultAsync();
        }

        public async Task<LaundrySession?> DeleteSessionById(int id)
        {
            var getLaundrySessionById = await _context.Laundry
                .Include(ls => ls.LaundryStatus)
                .Include(m => m.Machine)
                .Include(tp => tp.TimePeriod)
                .Where(x => x.LaundrySessionId == id).FirstOrDefaultAsync();

            if(getLaundrySessionById !=null )
            {
                _context.Laundry.Remove(getLaundrySessionById);
                await _context.SaveChangesAsync();
                return getLaundrySessionById;
            }

            return null;
        }

        public async Task<LaundrySession?> UpdateSession(LaundrySession laundrySession)
        {
            if(laundrySession != null)
            {
                _context.Laundry.Update(laundrySession);
                await _context.SaveChangesAsync();
                return laundrySession;
            }

            return null;
        }

        public async Task<LaundrySession?> InsertSession(LaundrySession laundrySession)
        {
            if(laundrySession != null)
            {
                _context.Laundry.Add(laundrySession);
                await _context.SaveChangesAsync();
                return laundrySession;
            }

            return null;
        }

    }
}
