using AuthenticationBusinessLogic.DTO;
using AuthenticationServices.BusinessLogic;
using DataLayer;
using DataLayer.AuthenticationEntities;
using DataLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationBusinessLogic.LoginLogic
{
    public class LoginLogic
    {

        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtCreatorLogic _jwtCreator;
        public LoginLogic(
            AppDbContext context,
            UserManager<ApplicationUser> userManager,
            JwtCreatorLogic jwtCreator)
        {
            _context = context;
            _userManager = userManager;
            _jwtCreator = jwtCreator;
        }


        public async Task<(bool, string?)> UserAuthentication(string username, string password)
        {
            var userEntity = await _userManager.FindByNameAsync(username);                      // fail --> Null
            var passwordCheck = await _userManager.CheckPasswordAsync(userEntity, password);    // fail --> false

            var resultsBool = (userEntity is null || passwordCheck is false) ? false : true;
            var resultsUserId = (userEntity is null || passwordCheck is false) ? null : userEntity.Id;

            return (resultsBool, resultsUserId);                                                                     // return results
        }


        public async Task<AppSession> CreateSession(string userId, string ipAddress)
        {
            // To Do - User Fingerprinting Session
            var user = await _userManager.FindByIdAsync(userId);
            var session = new AppSession(user);
            session.CreatedByIp = ipAddress;
            _context.AppSessions.Add(session);
            _context.SaveChanges();
            return session;
        }

        public async Task<RefreshToken> CreateRefreshToken(string userId, AppSession session, string ipAddress)
        {
            var _user = await _userManager.FindByIdAsync(userId);
            var _session = await _context.AppSessions.FindAsync(session);

            var refreshToken = new RefreshToken(_user);
            refreshToken.CreatedByIp = ipAddress;
            refreshToken.AppSession = session!;

            using (var rngCryptoServiceProvider = RandomNumberGenerator.Create())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);
                var token = Convert.ToBase64String(randomBytes);
                refreshToken.Token = token;
            } // Creating Random Token


            _context.RefreshTokens.Add(refreshToken);
            _context.SaveChanges();
            return refreshToken;
        }

        public async Task<string> CreateAccessToken(string userId, AppSession session, string ipAddress)
        {
            var _user = await _userManager.FindByIdAsync(userId);

            var tokenPrep = await _jwtCreator.GetTokenAsync(_user);
            var accessToken = new JwtSecurityTokenHandler().WriteToken(tokenPrep);

            return accessToken;
        }



    }
}
