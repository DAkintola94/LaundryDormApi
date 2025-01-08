namespace LaundryDormApi.Model.DomainModel
{
    public class MaintenanceLogModel
    {
        public int MaintenanceLogId { get; set; }
        public string? MachineName { get; set; }
        public string? IssueDescription { get; set; }
        public DateTime? ReportedDate { get; set; }
        public DateTime? SolvedDate { get; set; }
        public string? TechnicianName { get; set; }

        public int? MachineId { get; set; }
        public MachineModel Machine { get; set; }

    }
}
