namespace LaundryDormApi.Model.DomainModel
{
    public class LaundrySession
    {
        public int LaundrySessionId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserEmail { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? ReservationTime { get; set; }
        public DateOnly? ReservationDate { get; set; } 
        public string? Message { get; set; }


        public int? LaundryStatusID { get; set; }
        public LaundryStatusState? LaundryStatus { get; set; } //you can get the status name from the property inside the LaundryStatusState class


        public int? SessionPeriodId { get; set; }
        public SessionPeriodModel? SessionPeriod { get; set; } //you can get the session period value from the property inside the Sessionperiod class


        public int? MachineId { get; set; }
        public MachineModel? Machine { get; set; }


    }
}
