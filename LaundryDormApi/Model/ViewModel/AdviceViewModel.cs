using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Model.ViewModel
{
    public class AdviceViewModel
    {
        public int PosterId { get; set; }
        public string AuthorName { get; set; }
        public string InformationMessage { get; set; }
        public string EmailAddress { get; set; }
        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public int CategoryID { get; set; }

    }
}
