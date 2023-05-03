using AuthenticationBusinessLogic.DTO;
using Microsoft.AspNetCore.Identity;
using System.Drawing.Printing;
using System.IdentityModel.Tokens.Jwt;

namespace AuthenticationServices.AuthenticationService
{
    public interface IAuthenticationService
    {
        public Task<LoginResult> Login(LoginRequest loginRequest, string ipAddress);
        public Task<SignInResultDTO> SignIn(SignInRequest signInRequest);
        public Task<RefreshResult> RefreshToken(string currentRefreshToken, string currentAccessToken);
        //public Task<LoginResult> RevokeToken(string refreshToken, string ipAdress);
    }
}
