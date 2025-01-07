namespace LaundryDormApi.Model.DomainModel
{
    public class LaundrySession
    {
        public int LaundrySessionId { get; set; }
        public string? UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserEmail { get; set; }

        public string? PhoneNumber { get; set; }
        public DateTime ReservationTime { get; set; }
        public string? Message { get; set; }
        //public int? LaundryStatusID { get; set; }
        public LaundryStatusState? LaundryStatus { get; set; }
        public string? LaundryStatusDescription { get; set; }

        public DateTime? SessionStart { get; set; }
        public DateTime? SessionEnd { get; set; }

        public int? MachineId { get; set; }
        public string? MachineName { get; set; }
        public MachineModel? Machine { get; set; }
        public ApplicationUser? AppUser { get; set; }


    }
}
