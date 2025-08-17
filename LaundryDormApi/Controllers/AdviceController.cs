using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LaundryDormApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdviceController : ControllerBase
    {
        private readonly IAdviceSetRepository _adviceRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdviceController(IAdviceSetRepository adviceRepository, UserManager<ApplicationUser> userManager)
        {
            _adviceRepository = adviceRepository;
            _userManager = userManager;
        }

        [HttpPost]
        [Route("AdviceFetcher")]
        public async Task<IActionResult> InitiateAdvice([FromBody] AdviceViewModel adviceViewModel, CancellationToken cancellationToken = default)
        {
            if (adviceViewModel != null)
            {
                AdviceSet adviceDomainModel = new AdviceSet
                {
                    //ID is created automatically when data is sent to the DB, date is also set to auto creation upon validation success.
                    //PosterID was created in the case of using id to find users post from database!
                    PosterName = adviceViewModel.AuthorName,
                    Message = adviceViewModel.InformationMessage,
                    Email = adviceViewModel.EmailAddress,
                    CategoryID = adviceViewModel.CategoryID,
                    Date = adviceViewModel.Date,
                    StatusId = 1 //foreignkey for advice status, set to "not inspected" straight away
                };

                await _adviceRepository.InsertAdvice(adviceDomainModel, cancellationToken);
                return Ok(adviceDomainModel);
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        [Route("FetchAdvice")]
        [Authorize]
        public async Task<IActionResult> GetAdvice([FromQuery] string? namefilter, [FromQuery] string? nameQuery,
            [FromQuery] string? mailFilter, [FromQuery] string? mailQuery,
            [FromQuery] string? dateFilter, [FromQuery] string? dateQuery,
            [FromQuery] string? categoryFilter, [FromQuery] string? categoryQuery,
            [FromQuery] string? sortBy, [FromQuery] bool? isAscending, CancellationToken cancellationToken = default,
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50
            )
        {
            var currentAdmin = await _userManager.GetUserAsync(User);

            var getAdviceFromDb = await _adviceRepository.GetAllAdvice(namefilter, nameQuery, mailFilter, mailQuery,
                categoryFilter, categoryQuery,
                dateFilter, dateQuery,
                sortBy, isAscending ?? true, cancellationToken, pageNumber, pageSize);

            if (getAdviceFromDb != null && currentAdmin != null)
            {
                var adviceViewModel = getAdviceFromDb.Select(adviceDB => new AdviceViewModel
                {
                    InformationMessage = adviceDB.Message,
                    AuthorName = adviceDB.PosterName,
                    Date = adviceDB.Date, //retreiving the date that was auto created through model logic
                    EmailAddress = adviceDB.Email,
                    PosterId = adviceDB.PosterId,

                    InspectedDate = adviceDB.AdminInspectionDate, //nullable value in model
                    InspectorName = adviceDB.InspectedByAdmin, //nullable value in model
                    InspectorEmail = adviceDB.AdminEmail, //nullable value in model

                    CategoryName = adviceDB.CategoryModel?.CategoryName, //Getting the value from the category, its also mapped as foreign key, this is just retrieving its value based on the id that is on.

                    ReportStatus = adviceDB.StatusModel?.StatusDescription

                }).ToList();

                return Ok(adviceViewModel);
            }
            return NotFound();
        }

        [HttpGet]
        [Route("GetAdviceId")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdviceById(int usersId, CancellationToken cancellationToken = default)
        {
            var currentAdmin = await _userManager.GetUserAsync(User);
            var getSessionById = await _adviceRepository.GetAdviceById(usersId, cancellationToken);

            if(currentAdmin != null && getSessionById != null)
            {
                AdviceViewModel adviceViewModel = new AdviceViewModel
                {
                    EmailAddress = getSessionById.Email,
                    InformationMessage = getSessionById.Message,
                    AuthorName = getSessionById.PosterName,
                    Date = getSessionById.Date,
                    CategoryName = getSessionById.CategoryModel?.CategoryName ?? string.Empty
                };

                //Update information of which admin inspected the user/id and when. 
                getSessionById.AdminInspectionDate = DateTime.UtcNow;
                getSessionById.InspectedByAdmin = currentAdmin.FirstName + currentAdmin.LastName;
                getSessionById.AdminEmail = currentAdmin.Email;
                getSessionById.StatusId = 2; //setting the status to "inspected" by admin, foreign key for advice status

                await _adviceRepository.UpdateAdvice(getSessionById, cancellationToken);

                return Ok(adviceViewModel);
            }

            return BadRequest("Something went wrong, contact IT");
        }

    }
}
