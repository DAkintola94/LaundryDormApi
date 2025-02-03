using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IReservationRepository
    {
        public Task<IEnumerable<ReservationDto>> GetAllReservation();
        public Task<ReservationDto?> UpdateReservation(ReservationDto reservationDto);
        public Task<ReservationDto?> InsertReservation(ReservationDto reservationDto);
        public Task<ReservationDto?> GetReservationById(int id);
        public Task<ReservationDto?> DeleteReservationById(int id);

    }
}
