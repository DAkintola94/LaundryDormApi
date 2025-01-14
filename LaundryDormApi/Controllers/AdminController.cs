using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LaundryDormApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "System Administrator")]
    [Authorize(Roles = "Admin")]

    public class AdminController : ControllerBase
    {
    }
}
