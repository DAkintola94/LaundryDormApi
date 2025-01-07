namespace LaundryDormApi.Model.ViewModel
{
    public class MaintenanceViewModel
    {
        public int MaintenanceLogId { get; set; }
        public int MachineId { get; set; }
        public string? MachineName { get; set; }
        public string? IssueDescription { get; set; }
        public DateTime? ReportedDate { get; set; }
        public DateTime? SolvedDate { get; set; }
        public string? TechnicianName { get; set; }

    }
}
