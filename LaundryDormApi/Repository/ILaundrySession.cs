using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface ILaundrySession
    {
        public Task<IEnumerable<LaundrySession>> GetAllSession(string? dateFilter = null, string? dateQuery = null,
            string? statusFilter = null, string? statusQuery = null); //parameter is null by default
        public Task<LaundrySession> UpdateSession(LaundrySession laundrySession);
        public Task<LaundrySession?> GetSessionById(int id);
        public Task<LaundrySession> DeleteSessionById(int id);
        public Task<LaundrySession?> InsertSession(LaundrySession laundrySession);
    }
}
