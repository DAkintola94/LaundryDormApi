using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Model.ViewModel
{
    public class LaundrySessionViewModel
    {
        public int? SessionId { get; set; }
        public string? PersonalID { get; set; }
        public string? UserFirstName { get; set; }
        public string? UserLastName { get; set; }
        public string? PhoneNr { get; set; }
        public string? Email { get; set; }
        public DateTime? ReservationTime { get; set; }
        public string? UserMessage { get; set; }
        //public int? LaundryStatusID { get; set; }
        public string? LaundryStatusDescription { get; set; }

        public DateTime? SessionStart { get; set; }
        public DateTime? SessionEnd { get; set; }

        public int? MachineId { get; set; }
        public string? MachineName { get; set; }

    }
}
