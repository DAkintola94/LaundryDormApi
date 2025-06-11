using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace LaundryDormApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdviceController : ControllerBase
    {
        private readonly IAdviceSetRepository _adviceRepository;

        public AdviceController(IAdviceSetRepository adviceRepository)
        {
            _adviceRepository = adviceRepository;
        }

        [HttpPost]
        [Route("AdviceFetcher")]
        public async Task<IActionResult> InitiateAdvice([FromBody] AdviceViewModel adviceViewModel)
        {
            if(ModelState.IsValid)
            {
                AdviceSet adviceDomainModel = new AdviceSet
                {
                    //ID is created automatically when data is sent to the DB, date is also set to auto creation upon validation success.
                    //PosterID was created in the case of using id to find users post from database!
                    PosterName = adviceViewModel.AuthorName,
                    Message = adviceViewModel.InformationMessage,
                    Email = adviceViewModel.EmailAddress,
                    CategoryID = adviceViewModel.CategoryID,
                    Date = adviceViewModel.Date
                };

                await _adviceRepository.InsertAdvice(adviceDomainModel);
                return Ok(adviceDomainModel);
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        [Route("ExportAdvice")]
        public async Task<IActionResult> GetAdvice()
        {
            var getAdviceFromDb = await _adviceRepository.GetAllAdvice();

            if(getAdviceFromDb!= null)
            {
                var adviceViewModel = getAdviceFromDb.Select(adviceDB => new AdviceViewModel
                {
                    InformationMessage = adviceDB.Message,
                    AuthorName = adviceDB.PosterName,
                    Date = adviceDB.Date, //retreiving the date that was auto created through model logic
                    EmailAddress = adviceDB.Email,
                    PosterId = adviceDB.PosterId,
                    CategoryName = adviceDB.CategoryModel.CategoryName //Getting the value from the category, its also mapped as foreign key, this is just retrieving its value based on the id that is on.
                }).ToList();

                return Ok(adviceViewModel);
            }
            return NotFound();
        }

    }
}
