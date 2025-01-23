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
        [Route("Advice")]
        public async Task<IActionResult> InitiateAdvice([FromBody] AdviceViewModel adviceViewModel)
        {
            if(ModelState.IsValid)
            {
                AdviceSet adviceDomainModel = new AdviceSet
                {
                    PosterName = adviceViewModel.AuthorName,
                    Message = adviceViewModel.InformationMessage,
                    Email = adviceViewModel.EmailAddress,
                    CategoryID = adviceViewModel.CategoryID,
                    //CategoryType = 
                };

                await _adviceRepository.InsertAdvice(adviceDomainModel);
                return Ok();
            }

            return BadRequest(ModelState);
        }

    }
}
