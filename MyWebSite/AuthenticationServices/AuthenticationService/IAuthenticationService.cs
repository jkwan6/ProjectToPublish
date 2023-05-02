using AuthenticationBusinessLogic.DTO;
using Microsoft.AspNetCore.Identity;
using System.Drawing.Printing;
using System.IdentityModel.Tokens.Jwt;

namespace AuthenticationServices.AuthenticationService
{
    public interface IAuthenticationService
    {
        public Task<LoginResult> Login(LoginRequest loginRequest, string ipAddress);
        //public Task<LoginResult> RefreshToken(string oldRefreshToken, string ipAddress);
        public Task<LoginResult> RevokeToken(string refreshToken, string ipAdress);
    }
}
