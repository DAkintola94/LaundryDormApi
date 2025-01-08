using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace LaundryDormApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ILaundrySession _laundrySession;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMachineLogRepository _machineLogRepository;
        public HomeController(ILaundrySession laundrySession, UserManager<ApplicationUser> userManager,
            IMachineLogRepository machineLogRepository, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _machineLogRepository = machineLogRepository;
            _laundrySession = laundrySession;
            _signInManager = signInManager;
        }

        [HttpGet]
        public async Task<IActionResult> HomePage()
        {
            var getDataFromDb = await _laundrySession.GetAllSession();
            var currentUser = await _userManager.GetUserAsync(User);

            //if(currentUser == null)
            //{
                //return Unauthorized();
            //}

            if(getDataFromDb != null) 
            {
                var getLaundryData = getDataFromDb.Select(
                    x => new LaundrySessionViewModel
                    {
                        SessionId = x.LaundrySessionId,
                        // PersonalID = x.UserId,
                        //UserEmail = x.UserEmail,
                        //UserFirstName = x.FirstName,
                        //UserLastName = x.LastName,
                        //PhoneNr = x.PhoneNumber,
                        ReservationTime = x.ReservationTime,
                        UserMessage = x.Message,
                        MachineId = x.MachineId,
                        SessionStart = x.SessionStart,
                        SessionEnd = x.SessionEnd,
                        MachineName = x.Machine?.MachineName
                    }

                    );

                return Ok(getLaundryData);
            }

            return BadRequest();

        }

        [HttpPost]
        public async Task<IActionResult> HomePage([FromBody] LaundrySessionViewModel laundrySessionViewModel)
        {
            var currentUser = await _userManager.GetUserAsync(User);

            //if(currentUser == null)
            //{
                //return Unauthorized();
            //}
          
            if(ModelState.IsValid) 
            {
                LaundrySession laundrySession = new LaundrySession
                {
                    //UserId = currentUser.Id,
                    //UserEmail = currentUser.Email,
                    //FirstName = currentUser.FirstName,
                    //LastName = currentUser.LastName,
                    //PhoneNumber = currentUser.PhoneNumber,
                    ReservationTime = laundrySessionViewModel.ReservationTime,
                    Message = laundrySessionViewModel.UserMessage,
                    MachineId = laundrySessionViewModel.MachineId,
                    SessionStart = laundrySessionViewModel.SessionStart,
                    SessionEnd = laundrySessionViewModel.SessionEnd
                };
                //await _laundrySession.InsertSession(laundrySession);
                return Ok(laundrySessionViewModel);
            }

            return BadRequest();

        }



    }
}
