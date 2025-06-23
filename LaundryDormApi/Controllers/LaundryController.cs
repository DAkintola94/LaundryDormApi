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
            
            //remember, its the foreignkey in SessionPeriod we are using to decide the time from xx:xx to xx:xx we want our laundry

            if (laundrySessionViewModel!=null)
            {
                LaundrySession laundrySessionDomain = new LaundrySession
                {
                    UserEmail = laundrySessionViewModel.Email,
                    Name = laundrySessionViewModel.SessionUser, //our claim is sending the name as first name + last name. Therefore, this single variable is enough 
                    PhoneNumber = laundrySessionViewModel.PhoneNr,
                    Message = laundrySessionViewModel.UserMessage,
                    MachineId = laundrySessionViewModel.MachineId,
                    ReservationTime = DateTime.Now,
                    SessionPeriodId = laundrySessionViewModel.SessionId, // the session period/time is set based on what user has selected in the front end. The periods are seeded in the db context
                    LaundryStatusID = 1 // 1 is the default value for "In Progress" status, this is set in the db context seeding
                };

                if(!isConflict) //if there is no conflict, insert value into database
                {
                    var addedLaundrySession = await _laundrySession.InsertSession(laundrySessionDomain); //need to do it like this if we want the correct id
                                                                                                           //the variable is attached to ef core, which have inserted the object in db and given it an id
                                                                                                            //now we can retreive the correct id of the session and work with it
                    

                    return Ok(new {id = addedLaundrySession.LaundrySessionId}); //returning the id of the session that was recently created/added in the database
                }

                return BadRequest("Something went wrong");
            }
            return BadRequest("Value have been set");
        }

        [HttpPost]
        [Route("SessionFinish")]
        public async Task<IActionResult> FinishLaundrySession() 
        {
            DateTime currentPeriod = DateTime.Now;

            DateTime firstLaundryTimePeriod =
                new DateTime(currentPeriod.Year, currentPeriod.Month, currentPeriod.Day, 07, 00, 0);

            DateTime secondLaundryTimePeriod =
                new DateTime(currentPeriod.Year, currentPeriod.Month, currentPeriod.Day, 12, 00, 0);

            DateTime thirdLaundryTimePeriod =
                new DateTime(currentPeriod.Year, currentPeriod.Month, currentPeriod.Day, 17, 00, 0);

            DateTime lastLaundryTimePeriod =
                new DateTime(currentPeriod.Year, currentPeriod.Month, currentPeriod.Day, 23, 00, 0);


            var getSessions = await _laundrySession.GetAllSession();



            //use Where so we can work with id, it returns a !list! of all the matching condition
            //use FirstOrDefault so we can get the id, since it returns the first element that matches the condition
            //If we us ANY, we get a boolean that returns true if ANY of the condition matches

            var firstSessionCheck = getSessions
                .Where(x => x.ReservationTime.HasValue //Since reservationTime is set to date and time in model swapping, we have to do this
                && x.ReservationTime.Value.Date == DateTime.Today // and if the value and date (excluding time) matches the current date today.
                && x.SessionPeriodId == 1 
                && firstLaundryTimePeriod < secondLaundryTimePeriod);


            var secondSessionCheck = getSessions
                .Where(x => x.ReservationTime.HasValue
                && x.ReservationTime.Value.Date == DateTime.Today
                && x.SessionPeriodId == 2
                && secondLaundryTimePeriod > firstLaundryTimePeriod
                && secondLaundryTimePeriod < thirdLaundryTimePeriod
                );

            var thirdSessionCheck = getSessions
                .Where(x => x.ReservationTime.HasValue
                && x.ReservationTime.Value.Date == DateTime.Today
                && x.SessionPeriodId == 3
                && thirdLaundryTimePeriod > secondLaundryTimePeriod
                && thirdLaundryTimePeriod > firstLaundryTimePeriod
                );

            if(firstSessionCheck.Any())
            {
                var firstSessionList = firstSessionCheck.Take(50).ToList();

                var sessionValue = firstSessionList.Where(x => x.LaundryStatusID == 1); //.Where to get the conditions as list

                foreach (var elements in sessionValue) //We have to loop through the list to set the matching condition to 2, one by one
                {
                    elements.LaundryStatusID = 2;
                    await _laundrySession.UpdateSession(elements);
                }
            }
            if(secondSessionCheck.Any())
            {
                var secondSessionList = secondSessionCheck.Take(50).ToList();

                var sessionValue = secondSessionCheck.Where(x => x.LaundryStatusID == 1); //.Where to get the conditions as list

                foreach(var elements in sessionValue) //We have to loop through the list to set the matching condition to 2, one by one
                {
                    elements.LaundryStatusID = 1;
                    await _laundrySession.UpdateSession(elements);
                }

            }

            if(thirdSessionCheck.Any())
            {
                var thirdSessionValue = thirdSessionCheck.Where(x => x.LaundryStatusID == 1); //.Where to get the conditions as list

                foreach(var elements in thirdSessionValue) //We have to loop through the list to set the matching condition to 2, one by one
                {
                    elements.LaundryStatusID = 3;
                    await _laundrySession.UpdateSession(elements);
                }

            }

            return null;

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
