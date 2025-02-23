namespace LaundryDormApi.Model.ViewModel
{
    public class ReservationViewModel
    {
        public DateOnly ReservationDate { get; set; }
        public string? ReservationPeriodTime { get; set; }
        public string? Name { get; set; }
        public int MachineRoom { get; set; }

    }
}
