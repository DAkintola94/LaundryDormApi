using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IAdviceSetRepository
    {
        public Task<IEnumerable<AdviceSet>> GetAllAdvice();
        public Task<AdviceSet?> GetAdviceById(int id);
        public Task<AdviceSet> InsertAdvice(AdviceSet advice);
        public Task<AdviceSet> UpdateAdvice(AdviceSet advice);
        public Task<AdviceSet> DeleteAdviceById(int id);

    }
}
