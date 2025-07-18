using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IAdviceSetRepository
    {
        public Task<IEnumerable<AdviceSet>> GetAllAdvice(string? nameFilter = null, string? nameQuery = null
            , string? emailFilter = null, string? emailQuery = null,
            string? categoryFilter = null, string? categoryQuery = null,
            string? dateFilter = null, string? dateQuery = null,
            string? sortBy = null, bool isAscending = true, CancellationToken cancellationToken = default,
            int pageNumber = 1, int pageSize = 50);
        public Task<AdviceSet?> GetAdviceById(int id, CancellationToken cancellationToken = default);
        public Task<AdviceSet> InsertAdvice(AdviceSet advice, CancellationToken cancellationToken = default);
        public Task<AdviceSet> DeleteAdviceById(int id, CancellationToken cancellationToken = default);
        public Task<AdviceSet> UpdateAdvice(AdviceSet adviceSet, CancellationToken cancellationToken = default);

    }
}
