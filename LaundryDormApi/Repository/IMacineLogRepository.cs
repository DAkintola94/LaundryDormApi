using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IMacineLogRepository
    {
        public Task<IEnumerable<MaintenanceLogModel>> GetAllLog();
        public Task<MaintenanceLogModel?> GetLogById(int id);
        public Task<MaintenanceLogModel?> DeleteLogById(int id);
        public Task<MaintenanceLogModel?> AddLog(MaintenanceLogModel log);

        public Task<MaintenanceLogModel?> UpdateLog(MaintenanceLogModel log);


    }
}
