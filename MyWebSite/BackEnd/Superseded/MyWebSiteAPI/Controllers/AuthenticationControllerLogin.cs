using AuthenticationBusinessLogic.DTO;
using AuthenticationServices.AuthenticationService;
using DataLayer.Entities;
using DataLayer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http.Headers;

namespace MyWebSiteApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class AuthenticationController : Controller
    {
        private readonly IAuthenticationService _authService;

        public AuthenticationController(IAuthenticationService authService)
        {
            _authService = authService;
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            string? ipAd = ipAdress();

            var loginResult = await _authService.Login(loginRequest, ipAdress()!);

            bool isAuthorized = (loginResult.success) ? true : false;

            if (isAuthorized) setTokenCookie(loginResult.refreshToken!);

            return (isAuthorized) ? Ok(loginResult) : Unauthorized(loginResult);
        }



        [HttpPost("revoke-token")]
        public async Task<IActionResult> RevokeToken(string? refreshToken)
        {
            // accept refresh token in request body or cookie
            var token = refreshToken ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });
            await _authService.RevokeToken(token, ipAdress()!);
            return Ok(new { message = "Token revoked" });
        }

        /* <----------  Private Methods ----------> */
        private string? ipAdress()
        {
            if (this.Request.Headers.ContainsKey("X-Forwarded-For"))
                return this.Request.Headers["X-Forwarded-For"];
            else
                // Will convert IPV6 to IPV4. Will keep IPV4 to IPV4
                return this.HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
        }
        private void setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,                                            // Http Only
                Expires = DateTime.UtcNow.AddDays(7),                        // Cookie expires in 7 days

            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);  // Cookie Configs
        }

    }
}
