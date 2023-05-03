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
            var bothTokenMatches = await _refreshLogic.tokenMatches(currentRefreshToken, currentAccessToken);
            var refreshTokenIsValid = await _refreshLogic.refreshTokenIsValid(currentRefreshToken);

            var sessionValidity = await _refreshLogic.sessionIsValid(currentRefreshToken);

            if (!bothTokenMatches || !sessionValidity) return new RefreshResult();       // Early Return




            // Check if AccessToken Valid
            // Check AppSession Match
        }
    }
}
