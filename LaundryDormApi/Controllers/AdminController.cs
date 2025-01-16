using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LaundryDormApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AdminController : ControllerBase
    {
        private readonly IMachineLogRepository _machineLogRepository;
        public AdminController(IMachineLogRepository machineLogRepository)
        {
            _machineLogRepository = machineLogRepository;
        }

        [HttpPost]
        [Route("Maintenance")]
        public async Task<IActionResult> StartMaintenance([FromBody] MaintenanceViewModel maintenanceVLog)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MaintenanceLogModel maintenanceDomain = new MaintenanceLogModel
            {
                MachineId = maintenanceVLog.Machine_Id,
                IssueDescription = maintenanceVLog.Problem_Description,
                TechnicianName = maintenanceVLog.Technician_Name,
                LaundryStatusIdentifier = 4 //setting and seeding the status of the machine
            };

            await _machineLogRepository.AddLog(maintenanceDomain);
            return Ok(maintenanceVLog);
        }

        [HttpPost]
        [Route("MaintenanceAction")]
        public async Task<IActionResult> StopMaintenance([FromBody] MaintenanceViewModel maintenanceVLog )
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            MaintenanceLogModel maintenanceLogDomain = new MaintenanceLogModel
            {
                LaundryStatusIdentifier = 5 //setting and seeding the status of the machine
            };

            await _machineLogRepository.UpdateLog(maintenanceLogDomain);
            return Ok(maintenanceVLog);
        }
    }

}
