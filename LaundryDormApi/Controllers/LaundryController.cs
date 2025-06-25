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
        private readonly IUpdateCountRepository _updateCountRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public LaundryController(ILaundrySession laundrySession, ILaundryStatusStateRepository laundryStatusRepository,
            UserManager<ApplicationUser> userManager, IUpdateCountRepository updateCountRepository)
        {
            _laundrySession = laundrySession;
            _laundryStatusRepository = laundryStatusRepository;
            _updateCountRepository = updateCountRepository;
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




        /// <summary>
        ///Method to initialize session with value from the user
        /// Using isConflict variable to check for time stamp conflict. isConflict becomes a boolean due to .Any condition checking
        /// Remember to use FirstOrDefault if you want a single data value from the list
        /// SessionPeriod is a foreignkey in LaundrySessionModel, which we are using for laundry timestamp
        /// </summary>
        /// <param name="laundrySessionViewModel">The data we are getting from our user as json. Variable for LaundrySessionViewModel for model-swapping.
        /// Frontend gets the laundry timestamp the user desire, then modelswapping it with the domain model </param>
        /// <returns>The new ID if successful; otherwise, a BadRequest result.</returns>

        [HttpPost]
        [Route("StartSession")]
        [AllowAnonymous]
        public async Task<IActionResult> InitiateSession(LaundrySessionViewModel laundrySessionViewModel)
        {
            var getSession = await _laundrySession.GetAllSession();

            var isConflict = getSession.Any(s => //checking if there is any session with the same date (todays date) and session period id on the same day. You can use linq to get several datas from DB or list like this
             s.ReservationDate == DateOnly.FromDateTime(DateTime.Now) && 
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


        /// <summary>
        ///Method used to go through the database and check if the timestap is within current period
        ///Using Where to get matching condition as list, in-other to work with several values that we in the database/seeded
        /// </summary>
        /// <returns> Return null.</returns>
        [HttpPost]
        [Route("SessionFinish")]
        public async Task<IActionResult> FinishLaundrySession() 
        {
            DateTime now = DateTime.Now;
            var getLaundrySessions = await _laundrySession.GetAllSession();

            var timePeriod = new[] //creating time stamp with array
            {
                new {Id = 1, Start = new DateTime(now.Year, now.Month, now.Day, 7, 0, 0), End = new DateTime(now.Year, now.Month, now.Day, 12, 0, 0)}, //defining start to end with id, in array
                new {Id = 2, Start = new DateTime(now.Year, now.Month, now.Day, 12, 0, 0), End = new DateTime(now.Year, now.Month, now.Day, 17, 0, 0)},
                new {Id = 3, Start = new DateTime(now.Year, now.Month, now.Day, 17, 0, 0), End = new DateTime(now.Year, now.Month, now.Day, 23, 0, 0)}
            };

            int updatedCount = 0;

            foreach(var periods in timePeriod)
            {
                var sessionPeriod = getLaundrySessions.Where(x => x.ReservationTime.HasValue //.Where to get the conditions as list, so we can work with id and other values
                && x.ReservationTime.Value.Date == DateTime.Now
                && x.SessionPeriodId == periods.Id //need loop in-other to loop through and match the timeperiod with the sessionPeriodId seeded
                && x.LaundryStatusID == 1
                ).ToList();

                if(now > periods.End) //if current time exceeds the end period set
                {
                    foreach(var sessionToUpdate in sessionPeriod) ////We need loop to loop through the list to set the matching condition to 2, one by one
                    {
                        sessionToUpdate.LaundryStatusID = 2;
                        await _laundrySession.UpdateSession(sessionToUpdate);
                        updatedCount++;
                        await _updateCountRepository.UpdateCount(updatedCount);
                    }
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
