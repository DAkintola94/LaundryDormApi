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
        public async Task<IActionResult> CheckAvailability()
        {
            await _laundryStatusRepository.GetAllStatus();
            return Ok();
        }

        [HttpPost]
        [Route("StartSession")]
        [AllowAnonymous]
        public async Task<IActionResult> SetSession(LaundrySessionViewModel laundrySessionViewModel)
        {
            //var currentUser = _userManager.GetUserAsync(User);

            if(laundrySessionViewModel!=null) //&& currentUser
            {
                LaundrySession laundrySessionDomain = new LaundrySession
                {
                    ReservationTime = laundrySessionViewModel.ReservationTime,
                    UserEmail = laundrySessionViewModel.Email,
                    //FirstName = currentUser.Result.FirstName,
                    //LastName = currentUser.Result.LastName,
                    //PhoneNumber = currentUser.Result.PhoneNumber,
                    Message = laundrySessionViewModel.UserMessage,
                    MachineId = laundrySessionViewModel.MachineId,
                    SessionStart = laundrySessionViewModel.SessionStart,
                    SessionEnd = laundrySessionViewModel.SessionEnd,
                    LaundryStatusID = 1,
                };
                await _laundrySession.InsertSession(laundrySessionDomain);
                return Ok();
              
            }
            return BadRequest();
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

   

    }
}
