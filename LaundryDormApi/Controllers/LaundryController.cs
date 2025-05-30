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
    [Authorize]
    public class LaundryController : ControllerBase
    {
        private readonly ILaundrySession _laundrySession;
        private readonly ILaundryStatusStateRepository _laundryStatusRepository;
        private readonly IReservationRepository _reservationRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public LaundryController(ILaundrySession laundrySession, ILaundryStatusStateRepository laundryStatusRepository,
            UserManager<ApplicationUser> userManager, IReservationRepository reservationRepository)
        {
            _laundrySession = laundrySession;
            _laundryStatusRepository = laundryStatusRepository;
            _reservationRepository = reservationRepository;
            _userManager = userManager;
        }



        [HttpGet]
        [Route("Availability")]
        
        public async Task<IActionResult> CheckAvailability()
        {
            var getAllOrders = await _laundryStatusRepository.GetAllStatus();

            if(getAllOrders!= null)
            {
                return Ok(getAllOrders);
            }

            return BadRequest();
            
        }

        [HttpPost]
        [Route("DateAvailability")]
        public async Task<IActionResult> CheckSingularAvailability(DiverseViewModel diverseViewModel)
        {
            var getAllLaundry = await _laundrySession.GetAllSession();
            if(getAllLaundry != null && diverseViewModel != null)
            {
                var matchingDate = getAllLaundry.FirstOrDefault(sessionDate => sessionDate.ReservationTime.HasValue && sessionDate.ReservationTime.Value.Date == diverseViewModel.DateOfTime.Date);
                //linq instead of foreach loop, also checks if it has value

                if(matchingDate!= null)
                {
                    return Ok(matchingDate.ReservationTime); //this returns value back that js keyword "response" will catch
                }
            }

            return BadRequest();
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
            return BadRequest("Value have been set");
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

        [HttpPost]
        [Route("SetReservation")]
        [Authorize]
        public async Task<IActionResult> InsertReservationTime(ReservationViewModel reservationViewModel)
        {
            if(reservationViewModel!= null)
            {
                ReservationDto reservationDto = new ReservationDto
                {
                    ReservationTime = reservationViewModel.ReservationPeriodTime,
                    ReservationDate = reservationViewModel.ReservationDate,
                    ReservationHolder = reservationViewModel.Name,
                    MachineId = reservationViewModel.MachineRoom
                };

                await _reservationRepository.InsertReservation(reservationDto);
                return Ok(reservationDto);
            }
            return BadRequest("Error, report to admin");
        }
  
    }
}
