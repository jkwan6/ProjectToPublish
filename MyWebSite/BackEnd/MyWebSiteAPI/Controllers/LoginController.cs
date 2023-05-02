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

        private readonly AppDbContext _context;
        private readonly IAuthenticationService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthenticationController(
            AppDbContext context,
            IAuthenticationService authService,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _authService = authService;
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
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


        #region Stuff to develop later
        //[HttpPost("refreshtoken")]
        //public async Task<IActionResult> RefreshToken()
        //{
        //    var refreshToken = Request.Cookies["refreshToken"];

        //    var loginResult = await _authService.RefreshToken(refreshToken, ipAdress());

        //    setTokenCookie(loginResult.refreshToken);

        //    bool isAuthorized = (loginResult.success) ? true : false;

        //    return (isAuthorized) ? Ok(loginResult) : Unauthorized(loginResult);
        //}


        //[HttpPost("revoketoken")]
        //public IActionResult RevokeToken()
        //{
        //    var refreshToken = Request.Cookies["refreshtoken"];

        //    if (string.IsNullOrEmpty(refreshToken)) { return BadRequest("Token Required"); };

        //    var result = _authService.RevokeToken(refreshToken, ipAdress());

        //    return Ok(result);
        //}

        #endregion


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
                Expires = DateTime.UtcNow.AddDays(7)                        // Cookie expires in 7 days
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);  // Cookie Configs
        }

    }
}
