using LaundryDormApi.DataContext;
using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Net.WebSockets;
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
        private readonly LaundryDormDbContext _dbContext;

        public LaundryController(ILaundrySession laundrySession,
            UserManager<ApplicationUser> userManager, IUpdateCountRepository updateCountRepository,
            LaundryDormDbContext dbContext
            )
        {
            _laundrySession = laundrySession;
            _updateCountRepository = updateCountRepository;
            _userManager = userManager;
            _dbContext = dbContext;
        }

        /// <summary>
        /// Retrieves all laundry sessions for the logged-in user, with optional filtering by date and status.
        /// The JWT (Bearer) token sent from the frontend is automatically validated by ASP.NET Core's authentication middleware.
        /// If valid, user information is available via <c>HttpContext.User</c> for verifying session ownership.
        /// </summary>
        /// <param name="dateFilter">
        /// The name of the date field to filter by (e.g., <c>"ReservationTime"</c> or <c>"ReservedDate"</c>).
        /// </param>
        /// <param name="dateQuery">
        /// The date value to filter by, as a string (e.g., <c>"2025-07-12"</c>). Parsed to <c>DateTime</c> or <c>DateOnly</c> as needed.
        /// </param>
        /// <param name="statusFilter">
        /// The name of the status field to filter by (e.g., <c>"LaundryStatusDescription"</c>).
        /// </param>
        /// <param name="statusQuery">
        /// The status value to filter by (e.g., <c>"Aktivt tidspunkt"</c>).
        /// </param>
        /// <param name="sortBy">
        /// (Optional) The field name to sort the results by.
        /// </param>
        /// <param name="isAscending">
        /// (Optional) Whether to sort the results in ascending order. <c>true</c> for ascending, <c>false</c> for descending.
        /// </param>
        /// <returns>
        /// Returns a list of the user's laundry sessions matching the filters, or an error response if unauthorized.
        /// </returns>
        [HttpGet]
        [Route("SessionHistoric")]
        [Authorize] //Important, it cause the middleware to decode the Jwt token sent from frontend. Making us able to use HttpContext.User
        public async Task<IActionResult> PreviewSessionHistoric([FromQuery] string? dateFilter, [FromQuery] string? dateQuery,
            [FromQuery] string? statusFilter, [FromQuery] string? statusQuery,
            [FromQuery] string? sortBy, [FromQuery] bool? isAscending, CancellationToken cancellationToken = default,
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10) 
        {
            var currentUser = await _userManager.GetUserAsync(User);
            var getAllSession = await 
                _laundrySession.GetAllSession(dateFilter, dateQuery, statusFilter, statusQuery, 
                sortBy, isAscending ?? true, //If isAscending is null, the bool is true
                                             //For the repository to accept nullable bool
                cancellationToken,
                pageNumber, pageSize);
                                                                                                                            
            if(currentUser == null)
            {
                return Unauthorized("You must be logged in to use this function");
            }

            if(getAllSession == null)
            {
                return Ok(new List<LaundrySessionViewModel>()); //returning empty list
            }

            var usersValidSession = getAllSession.Where(usersDB =>
            usersDB.PhoneNumber == currentUser.PhoneNumber //checking if phonenumber from database matches the current logged in user phonenumber
            && usersDB.UserEmail == currentUser.Email) //checking if the email from database matches the current logged in users email
                .Select(fromDb => new LaundrySessionViewModel //then model swap and show content that belongs to user
                {
                    Email = fromDb.UserEmail,
                    PhoneNr = fromDb.PhoneNumber,
                    SessionUser = fromDb.Name,
                    ReservationDate = fromDb?.ReservedDate,
                    ReservationTime = fromDb?.ReservationTime,
                    LaundryStatusDescription = fromDb?.LaundryStatus?.StatusDescription,
                    StartPeriod = fromDb?.LaundrySessionStartTime,
                    EndPeriod = fromDb?.LaundrySessionEndTime,
                    MachineName = fromDb?.Machine?.MachineName,
                    UserMessage = fromDb?.Message,
                    SessionId = fromDb?.LaundrySessionId //important, so we can use cancelbooking method later
                });

            return Ok(usersValidSession);
        }

        /// <summary>
        /// Showing all available sloth to the user
        /// Filter out data that does not match, for instance, reserved dates or laundries that are already "finished"
        /// </summary>
        /// <returns>The new ID if successful; otherwise, a BadRequest result.</returns>
        /// 

        [HttpPost]
        [Route("CancelReservation")]
        [Authorize]
        public async Task<IActionResult> CancelBooking(int sessionId, CancellationToken cancellationToken = default) //Since we are already showing usershistoric above, just accept the id here and work with that
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if(currentUser == null)
            {
                return Unauthorized("Unauthorized user");
            }

            var laundrySessionId = await _laundrySession.GetSessionById(sessionId, cancellationToken);
            if(laundrySessionId != null)
            {
                if(laundrySessionId.UserEmail == currentUser.Email) //since email is unique by default, no duplication allowed
                {
                    laundrySessionId.LaundryStatusID = 5; //status changed to cancelled if logic matches
                    await _laundrySession.UpdateSession(laundrySessionId, cancellationToken);
                    return Ok(new {laundryId = laundrySessionId.LaundrySessionId });
                }
            }

            return Ok($"Can't find session with the id: {sessionId}");
        }

        [HttpGet]
        [Route("PopulateAvailability")]
        [Authorize]
        public async Task<IActionResult> CheckAvailability(CancellationToken cancellationToken = default)
        {
            var getAllOrders = await _laundrySession.GetAllSession(null, null, null, null, null, true, cancellationToken, 1, int.MaxValue);
            var currentUser = await _userManager.GetUserAsync(User);

            if(getAllOrders != null)
            {
                try
                {
                    var rapidSessionCalender = getAllOrders.Where(fromDb =>
                    !(fromDb.LaundryStatusID == 5) //Exclude value from db that is "canceled"

                    && (fromDb.ReservationTime.HasValue
                    || fromDb.ReservedDate.HasValue) 

                    && (fromDb.LaundryStatusID == 1
                    || fromDb.LaundryStatusID == 2
                    || fromDb.LaundryStatusID == 3
                    || fromDb.LaundryStatusID == 4
                    )).Select(showFromDb => new LaundrySessionViewModel
                    {
                        NameOfUser = showFromDb.Name,
                        SessionId = showFromDb.LaundrySessionId,
                        ReservationTime = showFromDb.ReservationTime, 
                        ReservationDate = showFromDb.ReservedDate, //populate frontend with this section
                        UserMessage = showFromDb.Message,
                        StartPeriod = showFromDb.LaundrySessionStartTime,
                        EndPeriod = showFromDb.LaundrySessionEndTime,
                        LaundryStatusDescription = showFromDb.LaundryStatus?.StatusDescription,
                        MachineName = showFromDb.Machine?.MachineName,
                        ImageUrlPath = showFromDb.Machine?.Image?.ImagePath //url image path according to the choosen machine
                    }).ToList();

                    return Ok(rapidSessionCalender);

                }
                catch (Exception ex)
                {
                    StatusCode(500, $"Unintended error: {ex}");
                }

            }

            return Ok("List is empty"); //return something else?

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
        public async Task<IActionResult> InitiateSession([FromBody]LaundrySessionViewModel laundrySessionViewModel, CancellationToken cancellationToken = default)
        {
            //DO NOT DELETE THESE TWO
            DateOnly dateToday = DateOnly.FromDateTime(DateTime.Today);
            DateTime todayTime = DateTime.UtcNow;

            //To accomodate the if statement below
            laundrySessionViewModel.ReservationDate = dateToday;
            if (!laundrySessionViewModel.ReservationDate.HasValue)
            {
                return BadRequest("Please choose a valid date");
            }


            var timePeriod = new[]
            {
               new {timeId = 1, timeStamp = new DateTime(todayTime.Year, todayTime.Month, todayTime.Day, 12, 0, 0)},
               new {timeId = 2, timeStamp = new DateTime(todayTime.Year, todayTime.Month, todayTime.Day, 17, 0, 0)},
               new {timeId = 3, timeStamp = new DateTime(todayTime.Year, todayTime.Month, todayTime.Day, 23, 0, 0)}
           };

            var period = timePeriod.FirstOrDefault(x => x.timeId == laundrySessionViewModel.SessionTimePeriodId); //linq to not make user be able to book session past time

            if (period != null && todayTime > period.timeStamp) 
            {
                return BadRequest("You can't book this session. The selected time period has already passed");
            }

            var currentUser = await _userManager.GetUserAsync(User);
            var getSession = await _laundrySession.GetAllSession(null, null, null, null, null, false, cancellationToken, 1, int.MaxValue);
            //int.max because we want all data to be returned

            //user selected date/session id
            //Setting up time based on what user set, !!IMPORTANT
            DateOnly selectedDate = laundrySessionViewModel.ReservationDate.Value;
           

            //important to match timestamp id based on what user choose, and how the date will align later
            int selectedPeriodId = laundrySessionViewModel.SessionTimePeriodId;

            //fetch the time period from DB 
            var defineTimePeriod = await _dbContext.TimeStamp.FindAsync(selectedPeriodId);

            if(defineTimePeriod == null)
            {
                return BadRequest("Something went wrong when trying to find valid timestamp in database");
            }

            TimeSpan startSpan = defineTimePeriod.Start;
            TimeSpan endSpan = defineTimePeriod.End;

            //Convert TimeSpan to TimeOnly
            TimeOnly startTime = TimeOnly.FromTimeSpan(startSpan);
            TimeOnly endTime = TimeOnly.FromTimeSpan(endSpan);

            //Combine date and time for start/end based date user set
            DateTime sessionStartTime = selectedDate.ToDateTime(startTime);
            DateTime sessionEndTime = selectedDate.ToDateTime(endTime);

            if(currentUser == null)
            {
                return Unauthorized("Unauthorized user");
            }

            try
            {
                if (laundrySessionViewModel != null)
                {
                    var isConflict = getSession.Any(sFromDb => //You can use linq to get several data from DB or list like this. The variable here becomes boolean, due to how .Any works
                     sFromDb.ReservedDate.HasValue
                    && sFromDb.ReservedDate.Value == selectedDate //To check for conflict on the SAME DAY!!
                    && sFromDb.TimePeriodId == selectedPeriodId //to check for conflict between the timestamp to set laundry
                    && (sFromDb.LaundryStatusID == 2
                    || sFromDb.LaundryStatusID == 3
                    || sFromDb.LaundryStatusID == 4)
                    ); //check if date is occupied, and if the active status are not conflicting


                    LaundrySession laundrySessionDomain = new LaundrySession
                    {
                        UserEmail = currentUser.Email,
                        Name = currentUser.FirstName + " " + currentUser.LastName, //getting information from the current logged in user, through the token sent, and decoded in the middleware
                        PhoneNumber = currentUser.PhoneNumber,
                        Message = laundrySessionViewModel.UserMessage,
                        MachineId = laundrySessionViewModel.MachineId, //Foreign key for MachineModel table
                        ReservationTime = DateTime.Now,
                        LaundrySessionStartTime = sessionStartTime,
                        LaundrySessionEndTime = sessionEndTime,
                        ReservedDate = DateOnly.FromDateTime(todayTime), //use this to populate the entire calender on frontend?
                        TimePeriodId = laundrySessionViewModel.SessionTimePeriodId, // the session period/time is set based on what user has selected in the front end. The periods are seeded in the db context
                        LaundryStatusID = 1 // 1 is the default value for "In Progress" status, this is set in the db context seeding
                    };

                    if (!isConflict) //if there is no conflict, insert value into database
                    {
                        var addedLaundrySession = await _laundrySession.InsertSession(laundrySessionDomain, cancellationToken); //Need variable if we want to extract an id, or any other data later on                                                                        

                        if(addedLaundrySession == null)
                        {
                            return BadRequest("An error occured, unable to insert session registration into database");
                        }

                        return Ok(new { backendSessionId = addedLaundrySession.LaundrySessionId}); //returning the id of the session that was recently created/added in the database
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
        [Authorize(Roles ="Admin")] //The bearer token sent from the frontend will be populated in User through the middleware
        //This part is VERY important as it tells the middleware in program.cs to decode the token that frontend sent.
        public async Task<IActionResult> FinalizeExpiredLaundrySessions(CancellationToken cancellationToken = default)
        {
            

            int? updatedCount = (await _updateCountRepository.GetCountNumber()) ?? 0; //get the count from the database (nullable), then update later

            DateTime today = DateTime.Today; //local-day, date, day
            DateTime now = DateTime.Now;     //local-time, date, day, minute

            var getLaundrySessions = await _laundrySession.GetAllSession(null, null, null, null, null, true, cancellationToken, 1, int.MaxValue);

            try
            {
                if (getLaundrySessions != null)
                {
                    var sessionPeriods = getLaundrySessions.Where(x //.Where to get the conditions as list, so we can work with id (FK in this case) and other values
                    => x.TimePeriod != null
                    && x.LaundrySessionEndTime < now // checking if the start time & end time is today, or before today (past time from the database)
                    && x.LaundryStatusID == 1 //checking if laundry status from db is active
                    ).ToList();

                    foreach (var sessionToUpdate in sessionPeriods)
                    {
                        if (sessionToUpdate.LaundrySessionEndTime < now) //We need loop to loop through the list to set the matching condition to 2, one by one
                        {
                            sessionToUpdate.LaundryStatusID = 2;
                            await _laundrySession.UpdateSession(sessionToUpdate, cancellationToken);

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
        public async Task<IActionResult> ReserveLaundrySlot([FromBody]LaundrySessionViewModel reservationViewModel, CancellationToken cancellationToken = default)
        {
            var getSession = await _laundrySession.GetAllSession(null, null, null, null, null, false, cancellationToken, 1, int.MaxValue);
            var currentUser = await _userManager.GetUserAsync(User);

            DateTime registrationTime = DateTime.UtcNow;

            DateTime nextDay = DateTime.UtcNow.AddDays(1);
            DateOnly dayAhead = DateOnly.FromDateTime(nextDay);

            if(reservationViewModel.ReservationDate.HasValue 
                && reservationViewModel.ReservationDate.Value < dayAhead) //user can only reserve 24 hours ahead of time
            {
                return BadRequest("You must book at least one day in advance");
            }

            if(currentUser == null)
            {
                return Unauthorized("Invalid user");
            }

            if (!reservationViewModel.ReservationDate.HasValue)
            {
                return BadRequest("Please choose a valid date");
            }

            //Setting up time based on what user set, !!IMPORTANT
            DateOnly selectedDate = reservationViewModel.ReservationDate.Value;

            //Getting timestamp based on what id was choosen
            int selectedPeriodId = reservationViewModel.SessionTimePeriodId;

            //fetch the time period from the seeded DB
            var defineTimePeriod = await _dbContext.TimeStamp.FindAsync(selectedPeriodId);

            if(defineTimePeriod == null)
            {
                return BadRequest("Choose a valid time stamp");
            }

            //Setting the timespan accordingly
            TimeSpan startSpan = defineTimePeriod.Start;
            TimeSpan endSpan = defineTimePeriod.End;

            //Convert TimeSpan to TimeOnly
            TimeOnly startTime = TimeOnly.FromTimeSpan(startSpan);
            TimeOnly endTime = TimeOnly.FromTimeSpan(endSpan);

            //Combine date and time for start/end based on what date user set
            DateTime sessionStartTime = selectedDate.ToDateTime(startTime);
            DateTime sessionEndTime = selectedDate.ToDateTime(endTime);

            if(reservationViewModel!= null 
                && getSession!= null 
                && reservationViewModel.ReservationDate.HasValue) //obs, reservation date need to have value
            {
                try
                {
                    LaundrySession reservationSessionDto = new LaundrySession
                    {
                        UserEmail = currentUser.Email,
                        PhoneNumber = currentUser.PhoneNumber,
                        Name = currentUser.FirstName + currentUser.LastName,

                        ReservationTime = registrationTime, //The time and date the user created the reservation
                        ReservedDate = reservationViewModel.ReservationDate,    //The date our user desire to book the laundry session ahead of time
                        Message = reservationViewModel.UserMessage,

                        LaundrySessionStartTime = sessionStartTime, //Time will be according to timestamp id, date will be according to what user set
                        LaundrySessionEndTime = sessionEndTime,

                        TimePeriodId = reservationViewModel.SessionTimePeriodId, // the session period is set based on what user has selected in the front end. The periods are seeded in the db context
                                                                                 //ops, need to work on reservation, date needs to be exact to when the user want to reservate

                        MachineId = 1, //default machine type for now

                        LaundryStatusID = 4  //FK for laundrystatus. Sets the status to reservation
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

                    return Ok("There was a conflict with the reservation, please choose another reservation date or time period.");

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
