using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface ILaundrySession
    {
        public Task<IEnumerable<LaundrySession>> GetAllSession(string? dateFilter = null, string? dateQuery = null,
            string? statusFilter = null, string? statusQuery = null,
            string? sortBy = null, bool isAscending = true, CancellationToken cancellationToken = default,
            int pageNumber = 1, int pageSize = 50
            ); //Some parameter are null by default. isAscending is true by default
        public Task<LaundrySession> UpdateSession(LaundrySession laundrySession, CancellationToken cancellationToken = default);
        public Task<LaundrySession?> GetSessionById(int id, CancellationToken cancellationToken = default);
        public Task<LaundrySession> DeleteSessionById(int id, CancellationToken cancellationToken = default);
        public Task<LaundrySession?> InsertSession(LaundrySession laundrySession, CancellationToken cancellationToken = default);
    }
}
