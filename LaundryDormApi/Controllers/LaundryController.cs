using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LaundryDormApi.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LaundryController : ControllerBase
    {
        private readonly ILaundrySession _laundrySession;
        private readonly ILaundryStatusStateRepository _laundryStatusRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public LaundryController(ILaundrySession laundrySession, ILaundryStatusStateRepository laundryStatusRepository,
            UserManager<ApplicationUser> userManager)
        {
            _laundrySession = laundrySession;
            _laundryStatusRepository = laundryStatusRepository;
            _userManager = userManager;
        }



        [HttpGet]
        [Route("Availability")]
        
        public async Task<IActionResult> CheckAvailability()
        {
            var getAllOrders = await _laundrySession.GetAllSession();

            if(getAllOrders!= null)
            {
                var getAvailabilityForUser = getAllOrders.Select(
                    fromDb => new LaundrySessionViewModel
                    {
                        ReservationTime = fromDb.ReservationTime,
                        ReservationDate = fromDb.ReservationDate,
                        PhoneNr = fromDb.PhoneNumber,
                        UserMessage = fromDb.Message,
                        LaundryStatusDescription = fromDb.LaundryStatus?.StatusDescription,
                        MachineName = fromDb.Machine?.MachineName, //using the model navigation property to get the machine name
                    });

                return Ok(getAllOrders); //sending to the frontend as JSON, remember to use the keyword "getAllOrders" to get the data from the database
            }

            return BadRequest("Something went wrong");
        }

        [HttpPost]
        [Route("StartSession")]
        [AllowAnonymous]
        public async Task<IActionResult> InitiateSession(LaundrySessionViewModel laundrySessionViewModel)
        {
            var getSession = await _laundrySession.GetAllSession();

            var isConflict = getSession.Any(s => //checking if there is any session with the same date (todays date) and session period id on the same day. You can use linq to get several datas from DB or list like this
             s.ReservationDate == DateOnly.FromDateTime(DateTime.Now) && //using any because we are getting list in return. Remember to use FirstOrDefault if you want a single data value from the list
             s.SessionPeriodId == laundrySessionViewModel.SessionId);


            if (laundrySessionViewModel!=null)
            {
                LaundrySession laundrySessionDomain = new LaundrySession
                {
                    UserEmail = laundrySessionViewModel.Email,
                    FirstName = laundrySessionViewModel.UserFirstName,
                    LastName = laundrySessionViewModel.UserLastName,
                    PhoneNumber = laundrySessionViewModel.PhoneNr,
                    Message = laundrySessionViewModel.UserMessage,
                    MachineId = laundrySessionViewModel.MachineId,
                    ReservationDate = DateOnly.FromDateTime(DateTime.Now),
                    ReservationTime = DateTime.Now,
                    SessionPeriodId = laundrySessionViewModel.SessionId, // the session period is set based on what user has selected in the front end. The periods are seeded in the db context
                    LaundryStatusID = 1 // 1 is the default value for "In Progress" status, this is set in the db context seeding
                };

                if(!isConflict) //if there is no conflict, insert value into database
                {
                    await _laundrySession.InsertSession(laundrySessionDomain);
                    return Ok();
                }

                return BadRequest("Something went wrong");
              
            }
            return BadRequest("Value have been set");
        }

        [HttpPost]
        [Route("SessionFinish")]
        public async Task<IActionResult> UpdateSessionFinished(int id)
        {
            var findSession = await _laundrySession.GetSessionById(id);
            if(findSession!=null)
            {
                findSession.LaundryStatusID = 2;
                await _laundrySession.UpdateSession(findSession);
            }
            return Ok();

        }

        [HttpPost]
        [Route("SetReservation")]
        [Authorize]
        public async Task<IActionResult> InsertReservationTime(LaundrySessionViewModel reservationVM)
        {
            var getSession = await _laundrySession.GetAllSession();
            

            if(reservationVM!= null)
            {
                LaundrySession reservationSessionDto = new LaundrySession
                {
                    ReservationTime = reservationVM.ReservationTime,
                    ReservationDate = reservationVM.ReservationDate,
                    UserEmail = reservationVM.Email,
                    PhoneNumber = reservationVM.PhoneNr,
                    Message = reservationVM.UserMessage,

                    SessionPeriodId = reservationVM.SessionId, // the session period is set based on what user has selected in the front end. The periods are seeded in the db context

                    MachineId = 1,

                    LaundryStatusID = 6
                };

                var isConflict = getSession.Any(s =>
                s.ReservationDate == reservationSessionDto.ReservationDate && //checking if the session from the database has the same date as the reservation date we are currently model swapping
                s.SessionPeriodId == reservationSessionDto.SessionPeriodId //checking if the session from the database has the same session period id as the reservation session period id
                );

                if (!isConflict)
                {
                    await _laundrySession.InsertSession(reservationSessionDto);
                    return Ok(reservationSessionDto);
                }

                return BadRequest("There is a conflict with the reservation time, please choose another time slot.");

            }
            return BadRequest("An error occured, report to admin");
        }
  
    }
}
