using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;

namespace LaundryDormApi.Repository
{
    public class LaundrySessionRepository : ILaundrySession
    {
        private readonly LaundryDormDbContext _context;
        public LaundrySessionRepository(LaundryDormDbContext context)
        {
            _context = context;
        }

        //parameter is null by default, and also nullable
        //We are returning data, regardless if filter value are requested by users or not. Due to making the parameter nullable
        public async Task<IEnumerable<LaundrySession>> GetAllSession(string? dateFilter = null, string? dateQuery = null, 
            string? statusFilter = null, string? statusQuery = null,
            string? sortBy = null, bool isAscending = true,
            int pageNumber = 1, int pageSize = 50
            )
        {
            var getSession = _context.Laundry
                .Include(ls => ls.LaundryStatus)
                .Include(m => m.Machine)
                .Include(tp => tp.TimePeriod)
                .AsQueryable(); //getSession is never null, AsQueryable() always returns a valid object

            //filtering

            if (!string.IsNullOrEmpty(dateFilter) && !string.IsNullOrEmpty(dateQuery))
            {
                if(dateFilter.Equals("ReservationTime", StringComparison.OrdinalIgnoreCase))
                {

                    if(DateTime.TryParse(dateQuery, out var date)) //converting dateQuery variable into datetime, and making it a new variable
                    {
                        getSession = getSession.Where(x => x.ReservationTime.HasValue
                        && x.ReservationTime.Value.Date == date.Date); //returning date only, not time
                    }
                }

                else if (dateFilter.Equals("ReserveDate", StringComparison.OrdinalIgnoreCase))
                {
                    if(DateOnly.TryParse(dateQuery, out var dateOnly)) //converting dateQuery variable into datetime, and making it a new variable
                    {
                        getSession = getSession.Where(x => x.ReservedDate.HasValue
                        && x.ReservedDate.Value == dateOnly);
                    }
            
                }

                if (!string.IsNullOrEmpty(statusFilter) && !string.IsNullOrEmpty(statusQuery))
                {
                    if (statusFilter.Equals("LaundryStatusDescription", StringComparison.OrdinalIgnoreCase))
                    {
                        getSession = getSession.Where(x => x.LaundryStatus != null
                        && x.LaundryStatus.StatusDescription != null
                        && x.LaundryStatus.StatusDescription.Contains(dateQuery)
                        );
                    }
                }
                // Add more filtering options here as needed
            }

            //sorting 
            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy.Equals("ReservationTime", StringComparison.OrdinalIgnoreCase))
                {
                    getSession = isAscending ?
                        getSession.OrderBy(x => x.ReservationTime) : //orderby (EFCORE) is asc boolean is true 
                        getSession.OrderByDescending(x => x.ReservationTime); //desc if asc boolean is not true
                }

                else if (sortBy.Equals("ReserveDate", StringComparison.OrdinalIgnoreCase))
                {
                    getSession = isAscending ?
                        getSession.OrderBy(x => x.ReservedDate) :
                        getSession.OrderByDescending(x => x.ReservedDate); //both are ternary condition for checking ascending boolean, else.
                }

                else if (sortBy.Equals("LaundryStatusDescription", StringComparison.OrdinalIgnoreCase))
                {
                    getSession = isAscending
                    ? getSession.OrderBy(x => x.LaundryStatus != null ? x.LaundryStatus.StatusDescription : string.Empty)
                    : getSession.OrderByDescending(x => x.LaundryStatus != null ? x.LaundryStatus.StatusDescription : string.Empty);
                }
            }

            var skipResult = (pageNumber - 1) * pageSize;


            return await getSession.Skip(skipResult).Take(pageSize).ToListAsync();
        }

        public async Task<LaundrySession?> GetSessionById(int id)
        {
            
                return await _context.Laundry
                .Include(ls => ls.LaundryStatus)
                .Include(m => m.Machine)
                .Include(tp => tp.TimePeriod)
                .Where(x => x.LaundrySessionId == id).FirstOrDefaultAsync();
            //No point with try catch since we are accepting a null value in return if nothing is found
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
