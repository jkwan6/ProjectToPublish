using AuthenticationBusinessLogic.DTO;
using DataLayer;
using DataLayer.AuthenticationEntities;
using DataLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationBusinessLogic.LoginLogic
{
    public class LoginLogic
    {

        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtCreatorService _jwtCreator;
        private readonly HttpRequest _httpRequest;
        public LoginLogic(
            AppDbContext context,
            UserManager<ApplicationUser> userManager,
            JwtCreatorService jwtCreator,
            HttpRequest httpRequest)
        {
            _context = context;
            _userManager = userManager;
            _jwtCreator = jwtCreator;
            _httpRequest = httpRequest;
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
            _context.SaveChanges();
            return session;
        }

        public async Task<RefreshToken> CreateRefreshToken(string userId, string sessionId, string ipAddress)
        {
            var user = await _userManager.FindByIdAsync(userId);
        }


        public async Task<LoginResult> Login(LoginRequest loginRequest, string ipAddress)
        {

            // Creation of Tokens
            var session = new AppSession(); // Paused here
            session.User = user;
            var tokenPrep = await _jwtCreator.GetTokenAsync(user);  // Token Prep
            var tokenToReturn = new JwtSecurityTokenHandler().WriteToken(tokenPrep);
            var refreshTokenToReturn = generateRefreshToken(ipAddress);

            // DbContext Logic
            if (user.RefreshTokens is null)
            {
                user.RefreshTokens = new List<RefreshToken>();
            }

            if (user.AppSessions is null)
            {
                user.AppSessions = new List<AppSession>();
            }

            if (session.RefreshTokens is null)
            {
                session.RefreshTokens = new List<RefreshToken>();
            }


            session.RefreshTokens.Add(refreshTokenToReturn);
            user.AppSessions.Add(session);
            user.RefreshTokens.Add(refreshTokenToReturn);

            _context.Users.Update(user);
            _context.SaveChanges();

            // Assigning Token to Login Result
            var loginResult = new LoginResult(true)
            { token = tokenToReturn, refreshToken = refreshTokenToReturn.Token };

            // Returning LoginResult
            return loginResult;
        }


    }
}
