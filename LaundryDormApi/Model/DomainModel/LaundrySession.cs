namespace LaundryDormApi.Model.DomainModel
{
    public class LaundrySession
    {
        public int LaundrySessionId { get; set; }
        public string? Name { get; set; }
        public string? UserEmail { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? ReservationTime { get; set; } //for the date and time the user registered their data

        public DateOnly? ReservedDate { get; set; } //The date our user desire to have their sloth reserved ahead of time
        public string? Message { get; set; }
        public int? LaundryStatusID { get; set; }
        public LaundryStatusState? LaundryStatus { get; set; } //you can get the status name from the property inside the LaundryStatusState class

        public TimePeriodModel? TimePeriod { get; set; }
        public int TimePeriodId { get; set; }

        public DateTime? LaundrySessionStartTime { get; set; }
        public DateTime? LaundrySessionEndTime { get; set; }
        public string? LaundryEndTime { get; set; }

        public int? MachineId { get; set; }
        public MachineModel? Machine { get; set; }


    }
}
