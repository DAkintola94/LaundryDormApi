using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IStreamlineSession
    {
        public Task<int> UpdateSession(CancellationToken cancellationToken);
    }
}
