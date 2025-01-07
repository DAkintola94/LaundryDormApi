using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using Microsoft.EntityFrameworkCore;

namespace LaundryDormApi.Repository
{
    public class MachineLogRepository : IMachineLogRepository
    {
        private readonly ApplicationDbContext _context;
        public MachineLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MaintenanceLogModel>> GetAllLog()
        {
            return await _context.MaintenanceLog.Take(50).ToListAsync();
        }

        public async Task<MaintenanceLogModel?> AddLog(MaintenanceLogModel logModel)
        {
            if(logModel != null)
            {
                _context.Add(logModel);
                await _context.SaveChangesAsync();
                return logModel;
            }
            return null;
        }

        public async Task<MaintenanceLogModel?> GetLogById(int id)
        {
            return await _context.MaintenanceLog.Where(x => x.MaintenanceLogId == id).FirstOrDefaultAsync(); 
        }

        public async Task<MaintenanceLogModel?> UpdateLog(MaintenanceLogModel maintenanceLogModel)
        {
            if(maintenanceLogModel!= null)
            {
                _context.MaintenanceLog.Add(maintenanceLogModel);
                await _context.SaveChangesAsync();
                return maintenanceLogModel;
            }
            return null;
        }

        public async Task<MaintenanceLogModel?> DeleteLogById(int id)
        {
            var getLogById = await _context.MaintenanceLog.Where(x => x.MaintenanceLogId == id).FirstOrDefaultAsync();
            if(getLogById != null)
            {
                _context.MaintenanceLog.Remove(getLogById);
                await _context.SaveChangesAsync();
                return getLogById;
            }
            return null;
        }

    }
}
