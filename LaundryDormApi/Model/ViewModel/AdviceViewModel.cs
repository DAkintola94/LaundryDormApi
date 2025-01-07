using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Model.ViewModel
{
    public class AdviceViewModel
    {
        public int PosterId { get; set; }
        public string PosterName { get; set; }
        public string Message { get; set; }
        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public Category CategoryModel { get; set; }
        public string CategoryType { get; set; }

    }
}
