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
        private readonly ILaundrySession _sessionRepository;
        public AdminController(IMachineLogRepository machineLogRepository, ILaundrySession sessionRepository)
        {
            _machineLogRepository = machineLogRepository;
            _sessionRepository = sessionRepository;
        }

        [HttpGet]
        [Route("EntireSessionLog")]
        public async Task<IActionResult> DispayAllSessions()
        {
            var getAllReservation = await _sessionRepository.GetAllSession();
            if(getAllReservation!= null)
            {
                var getReservationData = getAllReservation.Select(
                    fromDb => new LaundrySessionViewModel
                    {
                        ReservationTime = fromDb.ReservationTime,
                        ReservationDate = fromDb.ReservationDate,
                        Email = fromDb.UserEmail,
                        UserMessage = fromDb.Message,
                        PhoneNr = fromDb.PhoneNumber,
                        SessionPeriodTime = fromDb.SessionPeriod?.PeriodTitle,
                        SessionId = fromDb.LaundrySessionId,
                        MachineName = fromDb.Machine?.MachineName, //using the model navigation property to get the machine name
                        LaundryStatusDescription = fromDb.LaundryStatus?.StatusDescription, //using the model navigation property to get the laundry status name

                    });
                return Ok(getReservationData);
            }
            return BadRequest("Error, something went wrong");
        }


        [HttpGet]
        [Route("Log")]
        public async Task<IActionResult> DisplayLog()
        {
            var getLogs = await _machineLogRepository.GetAllLog();

            if(getLogs!= null)
            {
                var maintenanceViewModel = getLogs.Select(logsFromDb => new MaintenanceViewModel //Intend is to map, we are receiving an IEnumerable of MaintenanceLogModel and we are converting it to IEnumerable of MaintenanceViewModel
                {
                    Machine_Id = logsFromDb.MachineId,
                    Maintenance_Log_Id = logsFromDb.MaintenanceLogId,
                    Machine_Name = logsFromDb.MachineName,
                    Problem_Description = logsFromDb.IssueDescription,
                    Technician_Name = logsFromDb.TechnicianName
                });

                return Ok(maintenanceViewModel);
            }

            return BadRequest("An error occured");
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
