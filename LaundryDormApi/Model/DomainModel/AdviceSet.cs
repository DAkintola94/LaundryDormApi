using System.ComponentModel;

namespace LaundryDormApi.Model.DomainModel
{
    public class AdviceSet
    {
        public int PosterId { get; set; }
        public string PosterName { get; set; }
        public string Message { get; set; }
        public string Email { get; set; }
        public DateOnly Date { get; set; } 
        public DateTime? AdminInspectionDate { get; set; }
        public string? InspectedByAdmin { get; set; }
        public string? AdminEmail { get; set; }

        public int CategoryID { get; set; }
        public Category? CategoryModel { get; set; }

        public int StatusId { get; set; }
        public AdviceStatus? StatusModel { get; set; }

    }
}
