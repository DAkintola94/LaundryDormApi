namespace LaundryDormApi.Model.ViewModel
{
    public class ReservationViewModel
    {
        public int ReservationID { get; set; }
        public DateTime ReservationStartTime { get; set; }
        public DateTime ReservationEndtime { get; set; }
        public string? Name { get; set; }

        public int MachineRoom { get; set; }

    }
}
