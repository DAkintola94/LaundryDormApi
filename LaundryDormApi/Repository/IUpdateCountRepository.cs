using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IUpdateCountRepository
    {
        public Task<IEnumerable<UpdateCountModel>> GetAllCount();
        public Task<UpdateCountModel> UpdateCount(int countValue);

    }
}
