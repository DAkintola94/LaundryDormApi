namespace LaundryDormApi.Model.DomainModel
{
    public class ReservationDto
    {
        public int ReservationID { get; set; }

        public DateOnly ReservationDate { get; set; }

        public string? ReservationHolder { get; set; }
        public string? ReservationTime { get; set;}
        public MachineModel? Machine { get; set; }
        public int MachineId { get; set; }

    }
}
