using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.Repository
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly LaundryDormDbContext _context;
        public ReservationRepository(LaundryDormDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReservationDto>> GetAllReservation()
        {
            return await _context.Reservation
                .Include(m => m.Machine)
                .ToListAsync();
        }

        public async Task<ReservationDto?> GetReservationById(int id)
        {
            return await _context.Reservation
                .Include(m => m.Machine)
                .Where(x => x.ReservationID == id).FirstOrDefaultAsync();
        }

        public async Task<ReservationDto?> DeleteReservationById(int id)
        {
            var getReservationById = await _context.Reservation
                .Include(m => m.Machine)
                .Where(rs => rs.ReservationID == id).FirstOrDefaultAsync();
            if(getReservationById != null)
            {
                _context.Remove(getReservationById);
                await _context.SaveChangesAsync();
                return getReservationById;
            }
            return null;
        }

        public async Task<ReservationDto> InsertReservation(ReservationDto reservationDto)
        {
            if(reservationDto!= null)
            {
                _context.Reservation.Add(reservationDto);
                await _context.SaveChangesAsync();
                return reservationDto;
            }
            return null;
        }

        public async Task<ReservationDto?> UpdateReservation(ReservationDto reservationDto)
        {
            if(reservationDto != null)
            {
                _context.Reservation.Update(reservationDto);
                await _context.SaveChangesAsync();
                return reservationDto;
            }
            return null;
        }

    }
}
