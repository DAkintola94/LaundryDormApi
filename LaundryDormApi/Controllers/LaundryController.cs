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

        public LaundryController(ILaundrySession laundrySession)
        {
            _laundrySession = laundrySession;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceHolder()
        {
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> CheckAvailability()
        {
            return Ok();
        }


    }
}
