using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IUpdateCountRepository
    {
        public Task<IEnumerable<UpdateCountModel>> GetAllCount();
        public Task<UpdateCountModel> UpdateCount(int? countValue);
        public Task<int?> GetCountNumber(); //Task can work with any type of data.
                                            //As long as you return the correct datatype

    }
}
