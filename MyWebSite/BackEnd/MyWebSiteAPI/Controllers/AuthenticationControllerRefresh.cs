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
            string accessToken = Request.Headers["Authorization"];
            accessToken = accessToken.Substring(7);

            var refreshResult = await _authService.RefreshToken(refreshToken!, accessToken);

            setTokenCookie(refreshResult.refreshToken!);


            return Ok(refreshResult);
        }
    }
}
