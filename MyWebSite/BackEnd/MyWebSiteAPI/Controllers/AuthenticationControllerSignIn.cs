using Microsoft.AspNetCore.Mvc;
using AuthenticationServices.AuthenticationService;
using DataLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DataLayer;
using AuthenticationBusinessLogic.DTO;
using AuthenticationBusinessLogic.SignInLogic;

namespace MyWebSiteApi.Controllers
{
    public partial class AuthenticationController : Controller
    {

        // CONSTRUCTOR IN OTHER PARTIAL CLASS

        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest signInRequest)
        {

            string? ipAd = ipAdress();

            var signInResult = await _authService.SignIn(signInRequest);

            bool isAuthorized = (signInResult.success) ? true : false;

            return (isAuthorized) ? Ok(signInResult) : Unauthorized(signInResult);
        }

    }
}
