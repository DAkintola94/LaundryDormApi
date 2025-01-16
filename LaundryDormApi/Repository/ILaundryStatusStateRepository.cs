using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface ILaundryStatusStateRepository
    {
        public Task<IEnumerable<LaundryStatusState>> GetAllStatus();

    }
}
