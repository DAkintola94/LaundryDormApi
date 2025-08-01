﻿using LaundryDormApi.Model.DomainModel;
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
    [Authorize (Roles ="Admin")]

    public class AdminController : ControllerBase
    {
        private readonly ILaundrySession _sessionRepository;
        private readonly IUserRepository _userRepository;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenRepository _tokenRepository;
        public AdminController(ILaundrySession sessionRepository, IUserRepository userRepository
            ,SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, ITokenRepository tokenRepository)
        {
            _sessionRepository = sessionRepository;
            _userRepository = userRepository;
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenRepository = tokenRepository;
        }

        [HttpPost]
        [Route("SessionId")]
        public async Task<IActionResult> SessionHistoricId(int id, CancellationToken cancellationToken)
        {
            var getSessionById = await _sessionRepository.GetSessionById(id, cancellationToken);

            if(getSessionById != null)
            {
                LaundrySessionViewModel laundrySessionViewModel = new LaundrySessionViewModel
                {
                    Email = getSessionById.UserEmail,
                    EndPeriod = getSessionById.TimePeriod?.End,
                    StartPeriod = getSessionById.TimePeriod?.Start,
                    SessionId = getSessionById.LaundrySessionId,
                    SessionTimePeriodId = getSessionById.TimePeriodId,
                    PhoneNr = getSessionById.PhoneNumber,
                    UserMessage = getSessionById.Message,
                    MachineId = getSessionById.Machine?.MachineId,
                    LaundryStatusDescription = getSessionById.LaundryStatus?.StatusDescription,
                    MachineName = getSessionById.Machine?.MachineName,
                };

                return Ok(laundrySessionViewModel);
            }

            return Ok($"Session {id} was not in the database");
        }

        [HttpGet]
        [Route("EntireSessionLog")]
        public async Task<IActionResult> DispayAllSessions([FromQuery] string? dateFilter, [FromQuery] string? dateQuery, [FromQuery] string? statusFilter, [FromQuery] string? statusQuery,
        [FromQuery] string? sortBy, bool? isAscending = true,  CancellationToken cancellationToken = default, int pageNumber = 1, int pageSize = 50  )
        {
            var getAllReservation = await _sessionRepository.GetAllSession(dateFilter, dateQuery, statusFilter, statusQuery, sortBy, true, cancellationToken, 1, 50);
            if(getAllReservation!= null)
            {
                var getReservationData = getAllReservation.Select(
                    fromDb => new LaundrySessionViewModel
                    {
                        ReservationTime = fromDb.ReservationTime,
                        ReservationDate = fromDb.ReservedDate,
                        Email = fromDb.UserEmail,
                        UserMessage = fromDb.Message,
                        PhoneNr = fromDb.PhoneNumber,
                        StartPeriod = fromDb.TimePeriod?.Start,
                        EndPeriod = fromDb.TimePeriod?.End,
                        SessionId = fromDb.LaundrySessionId,
                        MachineName = fromDb.Machine?.MachineName, //using the model navigation property to get the machine name
                        LaundryStatusDescription = fromDb.LaundryStatus?.StatusDescription, //using the model navigation property to get the laundry status name
                    });
                return Ok(getReservationData);
            }
            return BadRequest("Error, something went wrong");
        }

        [HttpGet]
        [Route("UsersOverview")]
        public async Task<IActionResult> DisplayUsers([FromQuery] string? mailFilter, [FromQuery] string? mailQuery, 
            [FromQuery] string? firstNameFilter, [FromQuery] string? firstNameQuery,
            [FromQuery] string? lastNameFilter, [FromQuery] string? lastNameQuery, CancellationToken cancellationToken,
            [FromQuery] string? sortBy, [FromQuery] bool? isAscending, [FromQuery] int pageNumber = 1, int pageSize = 50 
            )
        {
            var getUsers = await _userRepository.GetAllUsers(mailFilter, mailQuery, 
                firstNameFilter, firstNameQuery, 
                lastNameFilter, lastNameQuery, 
                cancellationToken,
                pageNumber, pageSize, 
                sortBy, isAscending ?? true);

            var currentUser = await _userManager.GetUserAsync(User);

            if(getUsers!= null && currentUser != null)
            {
                getUsers.Select(fromDb => new RegisterViewModel
                {
                    Email = fromDb.Email ?? string.Empty,
                    UserFirstName = fromDb.FirstName ?? string.Empty,
                    UserLastName = fromDb.LastName ?? string.Empty,
                    PhoneNumber = fromDb.PhoneNumber ?? string.Empty,
                    ProfileId = fromDb.Id ?? string.Empty,
                    UserAddress = fromDb.Address ?? string.Empty
                });
                return Ok(getUsers);
            }

            return Ok("The list was empty");
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public async Task<IActionResult> DeleteMember(string usersId, CancellationToken cancellationToken = default)
        {
            var currentUser = await _userManager.GetUserAsync(User);
            var deleteUser = await _userRepository.DeleteUser(usersId, cancellationToken);
            if(deleteUser != null && currentUser != null)
            {
                return NoContent(); //204 no content, since user have been deleted
            }

            return BadRequest($"No user with the id {usersId} in the database");
        }

        [HttpPost]
        [Route("FindUser")]
        public async Task<IActionResult> GetUserId(string id, CancellationToken cancellationToken)
        {
            var findUser = await _userRepository.GetUserById(id, cancellationToken);
            if(findUser != null)
            {
                RegisterViewModel registerViewModel = new RegisterViewModel
                {
                    ProfileId = findUser.Id,
                    UserFirstName = findUser.FirstName,
                    UserLastName = findUser.LastName,
                    Email = findUser.Email ?? string.Empty,
                    PhoneNumber = findUser.PhoneNumber ?? string.Empty
                };
                return Ok(registerViewModel);
            }
            return Ok($"No user with the id {id} in the database");
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<IActionResult> CreateUserOrAdmin([FromBody]RegisterViewModel regViewModel)
        {
            if (regViewModel != null)
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

                if (result.Succeeded && regViewModel.isAdmin.HasValue)
                {
                    string roleValue = regViewModel.isAdmin.Value ? "Admin" : "RegularUser"; //ternary condition, check value isAdmin (true or false) according to what user set

                    var identityRole = await _userManager.AddToRoleAsync(applicationUser, roleValue);

                    if (identityRole.Succeeded)
                    {
                        var jwtToken = _tokenRepository.CreateJWTToken(applicationUser, new List<string> { roleValue });

                        LoginResponse loginResponse = new LoginResponse
                        {
                            JwtToken = jwtToken
                        };

                        return Ok($"New admin user created, token value: {jwtToken}"); 
                    }
                    else
                    {
                        return BadRequest(identityRole.Errors + "No user by that role");
                    }
                }

                    return BadRequest(new { Errors = result.Errors.Select(e => e.Description).ToList(), Message = "Error attempting to register " });
            }
                return Unauthorized("Something went wrong, report to admin");
        }

    }

}
