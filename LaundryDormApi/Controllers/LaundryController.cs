using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LaundryDormApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LaundryController : ControllerBase
    {
        private readonly ILaundrySession _laundrySession;
        private readonly ILaundryStatusStateRepository _laundryStatusRepository;
        private readonly int _seconds;
        private readonly bool _sessionActive;

        public LaundryController(ILaundrySession laundrySession, ILaundryStatusStateRepository laundryStatusRepository)
        {
            _laundrySession = laundrySession;
            _laundryStatusRepository = laundryStatusRepository;
            _seconds = 3600;
            _sessionActive = false;
        }

       

        [HttpGet]
        public async Task<IActionResult> CheckAvailability()
        {
            await _laundryStatusRepository.GetAllStatus();
            return Ok();
        }

   

    }
}
