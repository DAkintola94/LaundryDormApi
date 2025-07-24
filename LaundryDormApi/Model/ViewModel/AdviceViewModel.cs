using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Model.ViewModel
{
    public class AdviceViewModel
    {
        public int? PosterId { get; set; } //For showing poster id, and also to get id for a post
        public string AuthorName { get; set; } 
        public string InformationMessage { get; set; }
        public string EmailAddress { get; set; }
        public DateOnly Date { get; set; }
        public string? CategoryName { get; set; }

        public string? ReportStatus { get; set; }

        public DateTime? InspectedDate { get; set; }
        public string? InspectorName { get; set; }
        public string? InspectorEmail { get; set; }
        public int CategoryID { get; set; }

    }
}
