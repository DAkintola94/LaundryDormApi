namespace LaundryDormApi.Model.DomainModel
{
    public class ReservationDto
    {
        public int ReservationID { get; set; }
        public DateTime ReservationStart { get; set; }
        public DateTime ReservationEnd { get; set; }
        public string? ReservationHolder { get; set; }
        public MachineModel? Machine { get; set; }
        public int MachineId { get; set; }

    }
}
