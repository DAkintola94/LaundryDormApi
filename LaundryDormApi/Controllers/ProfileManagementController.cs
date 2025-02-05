using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LaundryDormApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileManagementController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenRepository _tokenRepository;

        public ProfileManagementController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager, ITokenRepository tokenRepository)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenRepository = tokenRepository;
        }

        [HttpPost]
        [Route("RegistrationAuth")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel regViewModel)
        {
            
            if(regViewModel != null && ModelState.IsValid)
            {
                ApplicationUser applicationUser = new ApplicationUser
                {
                    FirstName = regViewModel.UserFirstName,
                    LastName = regViewModel.UserLastName,
                    Address = regViewModel.UserAddress,
                    UserName = regViewModel.UserName, //identity which we inherit from already has UserName property, no need to create on in the model
                    Email = regViewModel.Email, //identity which we inherit from already has email property, no need to create on in the model
                    PhoneNumber = regViewModel.PhoneNumber //-||-
                };
            
             var result = await _userManager.CreateAsync(applicationUser, regViewModel.Password);

            if(result.Succeeded)
            {
                var identityRole = await _userManager.AddToRoleAsync(applicationUser, "RegularUser");

                if (identityRole.Succeeded)
                {
                        var jwtToken = _tokenRepository.CreateJWTToken(applicationUser, new List<string> { "RegularUser" });
                        LoginResponse loginResponse = new LoginResponse
                        {
                            JwtToken = jwtToken
                        };

                        return Ok(loginResponse); //returning jwtToken, although its a model
                }
                else
                {
                    return BadRequest(identityRole.Errors + "No user by that role");
                }

            }

                return BadRequest(new { Errors = result.Errors.Select(e => e.Description).ToList(), Message = "Error attempting to register " });

            }
            return Unauthorized("Something went wrong");   
        }
        [HttpPost]
        [Route("LoginAuth")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel loginViewModel)
        {
            var currentLogger = await _userManager.FindByEmailAsync(loginViewModel.Email);

            if(currentLogger != null && loginViewModel.Email!= null)
            {
                var checkPassword = await _userManager.CheckPasswordAsync(currentLogger, loginViewModel.Password);

                if(checkPassword) //boolean, if checkPassword is true(correct), proceed into the block logic
                {
                    var setRole = await _userManager.GetRolesAsync(currentLogger);

                    if (setRole != null)
                    {
                        var jwtToken = _tokenRepository.CreateJWTToken(currentLogger, setRole.ToList());
                        return Ok(jwtToken);
                    }

                }
                
            }

            return Unauthorized("Username or password wrong");
        }

        [HttpGet]
        [Route("LogOut")]
        public async Task<IActionResult> LogOut()
        {
            var currentUser = await _userManager.GetUserAsync(User);
            if(currentUser!= null)
            {
                await _signInManager.SignOutAsync();
                return NoContent();
            }

            return Unauthorized("No user found");
        }

    }
}
