using AuthenticationBusinessLogic.DTO;
using AuthenticationServices.AuthenticationService;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http.Headers;

namespace MyWebSiteApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : Controller
    {
        private readonly IAuthenticationService _authService;

        /* <------------  Constructor ------------> */
        public AuthenticationController(IAuthenticationService authService)
        {
            _authService = authService;                     // DI
        }

        /* <-------------  Endpoints -------------> */

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            string? ipAd = ipAdress();

            var loginResult = await _authService.Login(loginRequest, ipAdress()!);

            setTokenCookie(loginResult.refreshToken);

            bool isAuthorized = (loginResult.success) ? true : false;

            return (isAuthorized) ? Ok(loginResult) : Unauthorized(loginResult);
        }


        //[HttpPost("refreshtoken")]
        //public async Task<IActionResult> RefreshToken()
        //{
        //    var refreshToken = Request.Cookies["refreshToken"];

        //    var loginResult = await _authService.RefreshToken(refreshToken, ipAdress());

        //    setTokenCookie(loginResult.refreshToken);

        //    bool isAuthorized = (loginResult.success) ? true : false;

        //    return (isAuthorized) ? Ok(loginResult) : Unauthorized(loginResult);
        //}


        [HttpPost("revoketoken")]
        public IActionResult RevokeToken()
        {
            var refreshToken = Request.Cookies["refreshtoken"];

            if (string.IsNullOrEmpty(refreshToken)) { return BadRequest("Token Required"); };

            var result = _authService.RevokeToken(refreshToken, ipAdress());

            return Ok(result);
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
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

    }
}
