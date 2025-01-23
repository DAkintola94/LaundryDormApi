using System.ComponentModel;

namespace LaundryDormApi.Model.DomainModel
{
    public class AdviceSet
    {
        public int PosterId { get; set; }
        public string PosterName { get; set; }
        public string Message { get; set; }
        public string Email { get; set; }
        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public int CategoryID { get; set; }
        public Category CategoryModel { get; set; }
        public string? CategoryType { get; set; }

    }
}
