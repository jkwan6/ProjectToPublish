using DataLayer.Entities;
using DataLayer;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;
using DataLayer.AuthenticationEntities;
using System.IdentityModel.Tokens.Jwt;
using static System.Collections.Specialized.BitVector32;
using System.Net;
using System.Security.Cryptography;

namespace AuthenticationBusinessLogic.RefreshLogic
{
    public class RefreshLogic
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtCreatorLogic _jwtCreator;
        public RefreshLogic(
            AppDbContext context,
            UserManager<ApplicationUser> userManager,
            JwtCreatorLogic jwtCreator)
        {
            _context = context;
            _userManager = userManager;
            _jwtCreator = jwtCreator;
        }

        public async Task<bool> TokenMatches(string currentRefreshToken, string currentAccessToken) /// TODO - Theres some concurrency issues happening in there because of the Single of Default.  Gotta fix it eventually
        {
            // Checking if there are entities associated with the token provided
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == currentRefreshToken).FirstOrDefaultAsync();
            var accessEntityFromAccess = await _context.AccessTokens.Where(x => x.Token == currentAccessToken).FirstOrDefaultAsync();

            // If not, then return false
            if (refreshEntityFromRefresh == null || accessEntityFromAccess == null) return false;

            // Load up the Access Tokens from Entity
            refreshEntityFromRefresh!.AccessTokens = _context.AccessTokens
                .Where(x => x.RefreshToken == refreshEntityFromRefresh)
                .ToList();

            // Checking if the Refresh Token and the Access Tokens are linked together.
            var refreshContainsAccess = (refreshEntityFromRefresh!.AccessTokens.Where(x => x.Token.Equals(currentAccessToken)).First(x => x.Token == currentAccessToken) != null)
                ? true
                : false;
            
            // If the tokens are linked together, then they do match
            var TokenMatches = (refreshContainsAccess) ? true : false;

            return TokenMatches;
        }

        public async Task<bool> RefreshTokenIsValid(string currentRefreshToken)
        {
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == currentRefreshToken).SingleAsync();
            var isValid = (refreshEntityFromRefresh.IsActive is false || refreshEntityFromRefresh.IsExpired is true) ? false : true;
            return isValid;
        }


        public async Task<bool> SessionIsValid(string currentRefreshToken)
        {
            var currentSession = await _context.AppSessions.SingleOrDefaultAsync(x => x.RefreshTokens!.Any(x => x.Token == currentRefreshToken));
            var isValid = (currentSession!.IsActive is false || currentSession.IsExpired is true) ? false : true;
            return isValid;
        }


        public async Task<string> RefreshRefreshToken(string currentRefreshToken)
        {
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == currentRefreshToken).SingleAsync();
            var userId = refreshEntityFromRefresh.ApplicationUserId;
            var session = await _context.AppSessions.SingleOrDefaultAsync(x => x.RefreshTokens!.Any(x => x.Token == currentRefreshToken));

            var _user = await _userManager.FindByIdAsync(userId);
            
            var refreshToken = new RefreshToken(_user);
            _context.RefreshTokens.Attach(refreshToken);
            refreshToken.AppSession = session!;
            using (var rngCryptoServiceProvider = RandomNumberGenerator.Create())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);
                var token = Convert.ToBase64String(randomBytes);
                refreshToken.Token = token;
            } // Creating Random Token

            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();

            return refreshToken.Token;
        }


        public async Task<string> RefreshAccessToken(string currentAccessToken, string refreshTokenToUse)
        {
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == refreshTokenToUse).AsTracking().SingleAsync();
            var userId = refreshEntityFromRefresh!.ApplicationUserId;
            var _user = await _userManager.FindByIdAsync(userId);

            var accessToken = new AccessToken(refreshEntityFromRefresh!);

            var tokenPrep = await _jwtCreator.GetTokenAsync(_user);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenPrep);

            accessToken.Token = token;

            await _context.AccessTokens.AddAsync(accessToken);
            await _context.SaveChangesAsync();

            return accessToken.Token;
        }

    }
}
