namespace LaundryDormApi.Model.ViewModel
{
    public class MaintenanceViewModel
    {
        public int Maintenance_Log_Id { get; set; }
        public int? Machine_Id { get; set; }
        public string? Machine_Name { get; set; }
        public string? Problem_Description { get; set; }
        public DateTime? ReportedDate { get; set; }
        public DateTime? SolvedDate { get; set; }
        public string AuthorizedBy { get; set; }
    }
}
