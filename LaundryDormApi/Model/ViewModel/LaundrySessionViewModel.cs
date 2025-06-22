using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Model.ViewModel
{
    public class LaundrySessionViewModel
    {
        public int? SessionId { get; set; } //its for the time period the user want to set their laundry
                                            //its view model and not inserted in DbContext, so it won't autogenerate or cry about primary key!
        public string? SessionUser { get; set; }
        public string? PhoneNr { get; set; }
        public string? Email { get; set; }
        public DateTime? ReservationTime { get; set; } = DateTime.Now;
        public string? UserMessage { get; set; }
        public string? LaundryStatusDescription { get; set; }
        public DateOnly? ReservationDate { get; set; } 
        public int? MachineId { get; set; }
        public string? MachineName { get; set; }
        public string? SessionPeriodTime { get; set; } 

    }
}
