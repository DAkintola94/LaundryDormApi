using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface ILaundrySession
    {
        public Task<IEnumerable<LaundrySession>> GetAllSession();
        public Task<LaundrySession> UpdateSession(LaundrySession laundrySession);
        public Task<LaundrySession?> GetSessionById(int id);
        public Task<LaundrySession> DeleteSessionById(int id);
        public Task<LaundrySession?> InsertSession(LaundrySession laundrySession);
    }
}
