﻿using LaundryDormApi.Model.DomainModel;
using LaundryDormApi.Model.ViewModel;
using LaundryDormApi.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

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
                    Email = regViewModel.Email, //identity which we inherit from already has email property, no need to create on in the model
                    UserName = regViewModel.Email, //Since identity requires username, use email as username, and dont let the user write a username
                    PhoneNumber = regViewModel.PhoneNumber //--
                };
            
             var result = await _userManager.CreateAsync(applicationUser, regViewModel.Password);

            if(result.Succeeded)
            {
                var identityRole = await _userManager.AddToRoleAsync(applicationUser, "Regularuser");

                if (identityRole.Succeeded)
                {
                        var jwtToken = _tokenRepository.CreateJWTToken(applicationUser, new List<string> { "Regularuser" });

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
                //logout is up to the frontend, by clearing the stored token from localstorage
            }

            return Unauthorized("Username or password wrong");
         }


        /// <summary>
        /// Retrieves the authenticated user's profile information based on the JWT token provided in the request (frontend).
        /// </summary>
        /// <remarks>
        /// - Extracts the decoded user's identity information from the JWT token via ASP.NET Core's authentication middleware.
        /// - Uses <c>UserManager</c> to get the <c>ApplicationUser</c> entity from the database.
        /// - Maps relevant user properties into a <c>RegisterViewModel</c> for client-side consumption.
        /// - Returns a default message for any missing user data fields.
        /// </remarks>
        /// <returns>
        /// Returns <c>200 OK</c> with a populated <c>RegisterViewModel</c> if the user is authenticated.
        /// Returns <c>401 Unauthorized</c> if no user is authenticated.
        /// </returns>
        [HttpGet]
        [Route("ProfilePage")]
        [Authorize] //The bearer token sent from the frontend will be populated in User through the middleware
        public async Task<IActionResult> UsersProfile()
        {

            //var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
            //var usersEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            // You can also do this


            var currentUsers = await _userManager.GetUserAsync(User); // Gets the current user's information from the authentication token in the HTTP request context
                                                                      //Asp.net core middleware has already decoded the JWT token sent from the frontend and populated httpcontext.User for us
                                                                      //HttpContext is populating User (a ClaimsPrincipal) with the claims that we already embedded in the JWT token repository.

            if (currentUsers!= null)
            {  
                RegisterViewModel registerViewModel = new RegisterViewModel
                {
                    Email = currentUsers.Email ?? "Users email was not found",
                    PhoneNumber = currentUsers.PhoneNumber ?? "Users phonenumber was not found",
                    UserFirstName = currentUsers.FirstName ?? "Users first name is undefined",
                    UserLastName = currentUsers.LastName ?? "Users last name is undefined",
                    ProfileId = currentUsers.Id ?? "Users Id was not found",
                    UserAddress = currentUsers.Address ?? "Users address was not found"
                };

                return Ok(registerViewModel); //send the users information that the frontend can pick up
            }
            return Unauthorized("No user is signed in");
        }

    }
}
