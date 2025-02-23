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
        private readonly IReservationRepository _reservationRepository;
        public AdminController(IMachineLogRepository machineLogRepository, IReservationRepository reservationRepository)
        {
            _machineLogRepository = machineLogRepository;
            _reservationRepository = reservationRepository;
        }

        [HttpGet]
        [Route("EntireReservationLog")]
        public async Task<IActionResult> DispayAllReservation()
        {
            var getAllReservation = await _reservationRepository.GetAllReservation();
            if(getAllReservation!= null)
            {
                var getReservationData = getAllReservation.Select(
                    x => new ReservationViewModel
                    {
                        ReservationPeriodTime = x.ReservationTime,
                        ReservationDate = x.ReservationDate,
                        Name = x.ReservationHolder,
                        MachineRoom = x.MachineId
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
