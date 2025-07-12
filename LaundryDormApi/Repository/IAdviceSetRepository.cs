using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IAdviceSetRepository
    {
        public Task<IEnumerable<AdviceSet>> GetAllAdvice(string? nameFilter = null, string? nameQuery = null
            , string? emailFilter = null, string? emailQuery = null,
            string? categoryFilter = null, string? categoryQuery = null,
            string? dateFilter = null, string? dateQuery = null,
            string? sortBy = null, bool isAscending = true);
        public Task<AdviceSet?> GetAdviceById(int id);
        public Task<AdviceSet> InsertAdvice(AdviceSet advice);
        public Task<AdviceSet> UpdateAdvice(AdviceSet advice);
        public Task<AdviceSet> DeleteAdviceById(int id);

    }
}
