using AuthenticationBusinessLogic.DTO;
using DataLayer.AuthenticationEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServices.AuthenticationService
{
    public partial class AuthenticationService : IAuthenticationService
    {
        public async Task<RefreshResult> RefreshToken(string currentRefreshToken, string currentAccessToken)
        {
            // Check if AccessToken is linked to Refresh Token
            var bothTokenMatches = await _refreshLogic.TokenMatches(currentRefreshToken, currentAccessToken);
            var refreshTokenIsValid = await _refreshLogic.RefreshTokenIsValid(currentRefreshToken);
            var sessionValidity = await _refreshLogic.SessionIsValid(currentRefreshToken);

            if (!bothTokenMatches || !sessionValidity) return new RefreshResult();       // Early Return - Will have to Sign In Again

            // Create New Refresh And New Access Based on RT Validity
            string refreshTokenToUse;
            if (refreshTokenIsValid) { refreshTokenToUse = currentRefreshToken; }
            else
            {
                refreshTokenToUse = await _refreshLogic.RefreshRefreshToken(currentRefreshToken);
            };

            var newAccessToken = await _refreshLogic.RefreshAccessToken(currentAccessToken, refreshTokenToUse);

            return new RefreshResult()
            {
                accessToken = newAccessToken,
                refreshToken = refreshTokenToUse
            };
            // Check AppSession Match
        }
    }
}
