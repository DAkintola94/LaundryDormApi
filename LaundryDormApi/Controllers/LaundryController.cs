using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LaundryDormApi.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class LaundryController : ControllerBase
    {
        private readonly ILaundrySession _laundrySession;
        private readonly IUpdateCountRepository _updateCountRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public LaundryController(ILaundrySession laundrySession,
            UserManager<ApplicationUser> userManager, IUpdateCountRepository updateCountRepository)
        {
            _laundrySession = laundrySession;
            _updateCountRepository = updateCountRepository;
            _userManager = userManager;
        }

        /// <summary>
        /// Retrieves a specific laundry session for the logged-in user.
        /// The JWT token (Bearer token) sent from the frontend is automatically validated by ASP.NET Core's authentication middleware from program.cs
        /// If valid, the user information from the token becomes available through HttpContext.User, allowing the method to verify ownership of the session.
        /// 'User' is a built-in property available in controllers (inherited from ControllerBase) that represents the current authenticated user's claims.
        /// It is automatically populated by ASP.NET Core middleware during the processing of the current HTTP request.
        /// With this, we don't need the JWT token as parameter
        /// </summary>
        /// <returns>Returns the user's session if authorized; otherwise, an error response.</returns>


        [HttpGet]
        [Route("SessionHistoric")]
        [Authorize] //Important, it cause the middleware to decode the Jwt token sent from frontend. Making us able to use HttpContext.User

        public async Task<IActionResult> PreviewSessionHistoric() 
        {
            var currentUser = await _userManager.GetUserAsync(User);
            var getAllSession = await _laundrySession.GetAllSession();

            if(currentUser == null)
            {
                return Unauthorized("You must be logged in to use this function");
            }

            if(getAllSession == null)
            {
                return Ok("No laundry session found");
            }

            var usersValidSession = getAllSession.Where(usersDB =>
            usersDB.PhoneNumber == currentUser.PhoneNumber //checking if phonenumber from database matches the current logged in user phonenumber
            && usersDB.UserEmail == currentUser.Email) //checking if the email from database matches the current logged in users email
                .Select(fromDb => new LaundrySessionViewModel
                {
                    Email = fromDb.UserEmail,
                    PhoneNr = fromDb.PhoneNumber,
                    SessionUser = fromDb.Name,
                    ReservationDate = fromDb?.ReservedDate,
                    ReservationTime = fromDb?.ReservationTime,
                    LaundryStatusDescription = fromDb?.LaundryStatus?.StatusDescription,
                    StartPeriod = fromDb?.TimePeriod?.Start,
                    EndPeriod = fromDb?.TimePeriod?.End,
                    MachineName = fromDb?.Machine?.MachineName,
                    UserMessage = fromDb?.Message,
                    SessionId = fromDb?.LaundrySessionId
                });

            return Ok(usersValidSession);
        }


        /// <summary>
        /// Showing all available sloth to the user
        /// Filter out data that does not match, for instance, reserved dates or laundries that are already "finished"
        /// </summary>
        /// <returns>The new ID if successful; otherwise, a BadRequest result.</returns>
        /// 

        [HttpGet]
        [Route("Availability")]
        
        public async Task<IActionResult> CheckAvailability()
        {
            var getAllOrders = await _laundrySession.GetAllSession();

            if(getAllOrders != null)
            {
                try
                {
                    var filteredOrders = getAllOrders.Where(axeFromView => //Filtering data we don't want to show first. With a NOT condition
                    !(axeFromView.LaundryStatusID == 2 && axeFromView.ReservedDate.HasValue)) //Not condition can be done like this when using LINQ
                    .Select(showFromDb => new LaundrySessionViewModel      //selecting specific model from DB we want to show
                    {
                        ReservationTime = showFromDb.ReservationTime,
                        UserMessage = showFromDb.Message,
                        StartPeriod = showFromDb.TimePeriod?.Start, //getting the start time & end time via navigation property
                        EndPeriod = showFromDb.TimePeriod?.End,     //foreign-key is set above, eager loading set in repository
                        LaundryStatusDescription = showFromDb.LaundryStatus?.StatusDescription,
                        MachineName = showFromDb.Machine?.MachineName, //using the model navigation property to get the machine name
                    });

                    return Ok(filteredOrders);
                }
                catch(Exception ex)
                {
                    StatusCode(500, "An unexpected error occurred" + ex);
                }
            }
                return Ok("Session list is currently empty"); //sending to the frontend as JSON, remember to use the keyword "getAllOrders" to get the data from the database
        }


        /// <summary>
        /// Initiates a laundry session with values provided by the user.
        /// Information about the will be sent from the JWT Token
        /// </summary>
        /// <remarks>
        /// - Uses the <c>isConflict</c> flag (a boolean based on a LINQ <c>.Any()</c> check) to determine if a scheduling conflict exists.
        /// - If <c>isConflict</c> is <c>false</c>, the session is added to the database.
        /// - The <c>SessionPeriod</c> is a foreign key in <c>LaundrySessionModel</c>, seeded in the <c>DbContext</c>, used to map the desired time period.
        /// - Date-only comparison is used to match reservation conflicts on the same day (ignoring time of day).
        /// - Uses model-swapping from <c>LaundrySessionViewModel</c> to the domain model <c>LaundrySession</c>.
        /// </remarks>
        /// <param name="laundrySessionViewModel">
        /// JSON object from the frontend containing user input. 
        /// Includes the desired reservation timestamp and other session details, which are mapped to the domain model.
        /// </param>
        /// <returns>
        /// Returns the newly created session ID on success. 
        /// Returns <c>BadRequest</c> if a conflict exists or if the model is invalid. 
        /// Returns <c>StatusCode(500)</c> if a server-side exception occurs.
        /// </returns>


        [HttpPost]
        [Route("StartSession")]
        [Authorize] //The bearer token sent from the frontend will be populated in User through the middleware
                    //This part is VERY important as it tells the middleware in program.cs to decode the token that frontend sent
        public async Task<IActionResult> InitiateSession([FromBody]LaundrySessionViewModel laundrySessionViewModel)
        {
            DateTime today = DateTime.Today;

            var currentUser = await _userManager.GetUserAsync(User);
            var getSession = await _laundrySession.GetAllSession();

            if(currentUser == null)
            {
                return Unauthorized("Unauthorized user");
            }

            try
            {
                if (laundrySessionViewModel != null
                && laundrySessionViewModel.ReservationTime.HasValue //remember to send the reservation time from frontend as valid date
                && laundrySessionViewModel.ReservationTime.Value.Date == today)
                {

                    var isConflict = getSession.Any(sFromDb => //You can use linq to get several data from DB or list like this. The variable here becomes boolean, due to how .Any works
                     sFromDb.ReservedDate.HasValue
                    && sFromDb.TimePeriodId == laundrySessionViewModel.SessionTimePeriodId
                    && sFromDb.ReservedDate.Value == DateOnly.FromDateTime(laundrySessionViewModel.ReservationTime.Value) //comparing dateonly with time only, to check for conflict on the SAME DAY!!
                    );   

                    LaundrySession laundrySessionDomain = new LaundrySession
                    {
                        UserEmail = currentUser.Email,
                        Name = currentUser.FirstName + currentUser.LastName, //getting information from the current logged in user, through the token sent, and decoded in the middleware
                        PhoneNumber = currentUser.PhoneNumber,
                        Message = laundrySessionViewModel.UserMessage,
                        MachineId = laundrySessionViewModel.MachineId,
                        ReservationTime = DateTime.Now,
                        TimePeriodId = laundrySessionViewModel.SessionTimePeriodId, // the session period/time is set based on what user has selected in the front end. The periods are seeded in the db context
                        LaundryStatusID = 1 // 1 is the default value for "In Progress" status, this is set in the db context seeding
                    };

                    if (!isConflict ) //if there is no conflict, insert value into database
                    {
                        var addedLaundrySession = await _laundrySession.InsertSession(laundrySessionDomain); //Need variable if we want to extract an id, or any other data later on
                                                                                                             

                        if(addedLaundrySession == null)
                        {
                            return BadRequest("An error occured, unable to insert session registration into database");
                        }

                        return Ok(new { id = addedLaundrySession.LaundrySessionId } + " is the newly created session ID"); //returning the id of the session that was recently created/added in the database
                    }

                    else
                    {
                        return BadRequest("Session initiation was in conflict with registered time in the database");
                    }

                }
            }

            catch(Exception exp)
            {
                return StatusCode(500, "An error occured " + exp); //use StatusCode when there is an unexpected server-side error (unhandled exception)
            }
          
            return BadRequest("A value have been set");
        }


        /// <summary>
        /// Finalizes expired laundry sessions by checking if their time periods have passed.
        /// </summary>
        /// <remarks>
        /// - Queries all laundry sessions from the database and filters those with a non-null <c>TimePeriod</c>, 
        ///   an <c>End</c> time earlier than the current time, and a <c>LaundryStatusID</c> indicating they are active (value = 1).
        /// - Updates each expired session by setting its <c>LaundryStatusID</c> to 2 (indicating completed or expired).
        /// - Uses a nullable integer and the null-coalescing operator to safely retrieve and increment a count from the repository.
        /// - The count is updated in the database for each finalized session.
        /// </remarks>
        /// <returns>
        /// Returns <c>Ok</c> with a message if no sessions are updated, or a <c>StatusCode(500)</c> if an error occurs during processing.
        /// </returns>

        [HttpPost]
        [Route("FinalizeLaundrySession")]
        //[Authorize(Roles ="")] //The bearer token sent from the frontend will be populated in User through the middleware
        //This part is VERY important as it tells the middleware in program.cs to decode the token that frontend sent.
        public async Task<IActionResult> FinalizeExpiredLaundrySessions()
        {
            int? updatedCount = (await _updateCountRepository.GetCountNumber()) ?? 0; //get the count from the database (nullable), then update later

            DateTime today = DateTime.Today; //local-day, date, day
            DateTime now = DateTime.Now;     //local-time, date, day, minute

            var getLaundrySessions = await _laundrySession.GetAllSession();

            try
            {
                if (getLaundrySessions != null)
                {
                    var sessionPeriods = getLaundrySessions.Where(x //.Where to get the conditions as list, so we can work with id (FK in this case) and other values
                    => x.TimePeriod != null
                    && x.TimePeriod.End < now // checking if the start time & end time is today, or before today (past time from the database)
                    && x.LaundryStatusID == 1 //checking if laundry status from db is active
                    ).ToList();

                    foreach (var sessionToUpdate in sessionPeriods)
                    {
                        if (sessionToUpdate.TimePeriod?.End < now) //We need loop to loop through the list to set the matching condition to 2, one by one
                        {
                            sessionToUpdate.LaundryStatusID = 2;
                            await _laundrySession.UpdateSession(sessionToUpdate);

                            updatedCount++;
                            await _updateCountRepository.UpdateCount(updatedCount);
                        }
                    }

                    return Ok("Laundry sessions have been updated");
                }

                
            }
            catch (Exception err )
            {
                return StatusCode(500, $"An error occurred while trying to finalize expired laundry sessions {err}");
            }

            return Ok("No session to update in the database");
        }



        /// <summary>
        /// Reserves a laundry session for the authenticated user based on their selected time and date.
        /// </summary>
        /// <remarks>
        /// - Checks for conflicts by comparing the user's desired reservation date and time period ID against existing sessions in the database.
        /// - Uses the <c>isConflict</c> flag to determine if any existing session overlaps with the user's requested slot (based on <c>ReservedDate</c> and <c>TimePeriodId</c>).
        /// - If no conflict is found, the session is saved to the database with a default machine ID and a pre-seeded laundry status ID (value = 6).
        /// - <c>SessionPeriod</c> is a foreign key in the <c>LaundrySessionModel</c> and represents the desired time block (e.g., morning, afternoon).
        /// - The frontend sends the desired time/date, which is mapped from the <c>LaundrySessionViewModel</c> to the domain model.
        /// </remarks>
        /// <param name="reservationViewModel">
        /// The user’s reservation data, passed as a JSON object from the frontend. 
        /// This includes the reservation date, selected time period, contact details, and optional message.
        /// </param>
        /// <returns>
        /// Returns <c>Ok</c> with the newly created session if successful, 
        /// or an <c>Ok</c> with a conflict message if the slot is already taken. 
        /// Returns <c>BadRequest</c> if validation fails or input is invalid.
        /// </returns>

        [HttpPost]
        [Route("SetReservation")]
        [Authorize] //The bearer token sent from the frontend will be populated in User through the middleware
                    //This part is VERY important as it tells the middleware in program.cs to decode the token that frontend sent
        public async Task<IActionResult> ReserveLaundrySlot([FromBody]LaundrySessionViewModel reservationViewModel)
        {
            var getSession = await _laundrySession.GetAllSession();
            var currentUser = await _userManager.GetUserAsync(User);

            if(currentUser == null)
            {
                return Unauthorized("Invalid user");
            }

            if(reservationViewModel!= null 
                && getSession!= null 
                && reservationViewModel.ReservationTime.HasValue)
            {
                try
                {
                    LaundrySession reservationSessionDto = new LaundrySession
                    {
                        UserEmail = currentUser.Email,
                        PhoneNumber = currentUser.PhoneNumber,
                        Name = currentUser.FirstName + currentUser.LastName,

                        ReservationTime = reservationViewModel.ReservationTime, //The time and date the user created the reservation
                        ReservedDate = reservationViewModel.ReservationDate,    //The date our user desire to book the laundry session ahead of time
                        Message = reservationViewModel.UserMessage,

                        TimePeriodId = reservationViewModel.SessionTimePeriodId, // the session period is set based on what user has selected in the front end. The periods are seeded in the db context
                                                                                 //ops, need to work on reservation, date needs to be exact to when the user want to reservate

                        MachineId = 1, //default machine type for now

                        LaundryStatusID = 6  //FK for laundrystatus. Sets the status based on what we seeded in DBContext
                    };

                    var isConflict = getSession.Any(sFromDb =>
                    sFromDb.ReservedDate.HasValue
                    && sFromDb.ReservedDate == reservationViewModel.ReservationDate //checking if the session from the database has the same date as the reservation date we are currently model swapping
                    && sFromDb.TimePeriodId == reservationViewModel.SessionTimePeriodId //checking if the session from the db has the same session period id (start, end period) as the users desire 
                    );

                    if (!isConflict)
                    {
                        await _laundrySession.InsertSession(reservationSessionDto);
                        return Ok(reservationSessionDto);
                    }

                    return Ok("There was a conflict with the reservation, please choose another reservation date.");

                }
                catch (Exception ex)
                {
                    StatusCode(500, $"An error occurred while trying to reserve laundry sloth {ex}");
                }
            }
            return BadRequest("An error occurred, report to admin");
        }
    }
}
