using AuthenticationServices.BusinessLogic;
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

        public async Task<bool> TokenMatches(string currentRefreshToken, string currentAccessToken)
        {
            // Entities from tokens
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == currentRefreshToken).SingleAsync();
            var accessEntityFromAccess = await _context.AccessTokens.Where(x => x.Token == currentAccessToken).SingleAsync();

            // Entity from Relationship 
            var refreshEntityFromAccess = await _context.RefreshTokens.SingleOrDefaultAsync(x => x.AccessTokens.Any(x => x.Token == currentAccessToken));
            var test = _context.RefreshTokens.Where(x => x == refreshEntityFromAccess).Include(x => x.AccessTokens).ToList();
            var accessTokenFromRefresh = refreshEntityFromRefresh.AccessTokens.Last();

            // Check if Matches
            var refreshTokenMatches = (refreshEntityFromRefresh == refreshEntityFromAccess) ? true : false;
            var accessTokenMatches = (accessEntityFromAccess == accessTokenFromRefresh) ? true : false;

            var bothMatches = (!refreshTokenMatches || !accessTokenMatches) ? false : true;

            return bothMatches;
        }

        public async Task<bool> RefreshTokenIsValid(string currentRefreshToken)
        {
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == currentRefreshToken).SingleAsync();
            var isValid = (!refreshEntityFromRefresh.IsActive || refreshEntityFromRefresh.IsExpired) ? false : true;
            return isValid;
        }


        public async Task<bool> SessionIsValid(string currentRefreshToken)
        {
            var currentSession = await _context.AppSessions.SingleOrDefaultAsync(x => x.RefreshTokens!.Any(x => x.Token == currentRefreshToken));
            var isValid = (!currentSession!.IsActive || currentSession.IsExpired) ? false : true;
            return isValid;
        }


        public async Task<string> RefreshRefreshToken(string currentRefreshToken)
        {
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == currentRefreshToken).SingleAsync();
            var userId = refreshEntityFromRefresh.ApplicationUserId;
            var session = await _context.AppSessions.SingleOrDefaultAsync(x => x.RefreshTokens!.Any(x => x.Token == currentRefreshToken));

            var _user = await _userManager.FindByIdAsync(userId);
            var _session = await _context.AppSessions.FindAsync(session!.AppSessionId);

            var refreshToken = new RefreshToken(_user);
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
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == refreshTokenToUse).SingleAsync();
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
