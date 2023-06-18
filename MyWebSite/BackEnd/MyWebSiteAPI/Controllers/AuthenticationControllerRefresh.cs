using Microsoft.AspNetCore.Mvc;

namespace MyWebSiteApi.Controllers
{
    public partial class AuthenticationController : Controller
    {
        [HttpPost("refreshtoken")]
        public async Task<IActionResult> RefreshToken()
        {
            // Access Token from Http Headers
            // RefreshToken from Http-Only Cookie
            var refreshToken = Request.Cookies["refreshToken"];
            var accessToken = Request.Headers["token"];

            var refreshResult = await _authService.RefreshToken(refreshToken, accessToken);

            setTokenCookie(refreshResult.refreshToken!);


            return Ok(refreshResult);
        }
    }
}
