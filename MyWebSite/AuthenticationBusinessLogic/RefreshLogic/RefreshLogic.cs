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

        public async Task<bool> tokenMatches(string currentRefreshToken, string currentAccessToken)
        {
            // Entities from tokens
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == currentRefreshToken).SingleAsync();
            var accessEntityFromAccess = await _context.AccessTokens.Where(x => x.Token == currentAccessToken).SingleAsync();

            // Entity from Relationship 
            var refreshEntityFromAccess = await _context.RefreshTokens.SingleOrDefaultAsync(x => x.AccessTokens.Any(x => x.Token == currentAccessToken));
            var accessTokenFromRefresh = refreshEntityFromRefresh.AccessTokens.Last();

            // Check if Matches
            var refreshTokenMatches = (refreshEntityFromRefresh == refreshEntityFromAccess) ? true : false;
            var accessTokenMatches = (accessEntityFromAccess == accessTokenFromRefresh) ? true : false;

            var bothMatches = (!refreshTokenMatches || !accessTokenMatches) ? false : true;

            return bothMatches;
        }

        public async Task<bool> refreshTokenIsValid(string currentRefreshToken)
        {
            var refreshEntityFromRefresh = await _context.RefreshTokens.Where(x => x.Token == currentRefreshToken).SingleAsync();
            var isValid = (!refreshEntityFromRefresh.IsActive || !refreshEntityFromRefresh.IsExpired) ? false : true;
            return isValid;
        }


        public async Task<bool> sessionIsValid(string currentRefreshToken)
        {
            var currentSession = await _context.AppSessions.SingleOrDefaultAsync(x => x.RefreshTokens!.Any(x => x.Token == currentRefreshToken));
            var isValid = (!currentSession!.IsActive || !currentSession.IsExpired) ? false : true;
            return isValid;
        }

    }
}
