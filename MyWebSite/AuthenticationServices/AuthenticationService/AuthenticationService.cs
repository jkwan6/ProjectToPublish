using System.Security.Cryptography;
using DataLayer;
using Microsoft.AspNetCore.Identity;
using DataLayer.Entities;
using AuthenticationServices.DTO;
using System.IdentityModel.Tokens.Jwt;
using DataLayer.AuthenticationEntities;

namespace AuthenticationServices.AuthenticationService
{
    public class AuthenticationService: IAuthenticationService
    {

            // Properties
            private readonly AppDbContext _context;
            private readonly UserManager<ApplicationUser> _userManager;
            private readonly JwtCreatorService _jwtCreator;

            // Constructor
            public AuthenticationService(
                AppDbContext context,
                UserManager<ApplicationUser> userManager,
                JwtCreatorService jwtCreator
                )
            {
                _context = context;
                _userManager = userManager;
                _jwtCreator = jwtCreator;
            }

            // Login Method - Returns JWT and Refresh Token
            public async Task<LoginResult> Login(LoginRequest loginRequest, string ipAddress)
            {
            // Validation against DB
            var user = await _userManager.FindByNameAsync(loginRequest.Email);
            var password = await _userManager.CheckPasswordAsync(user, loginRequest.Password);

            // Early Return if Authentication Fails
            if (user is null || password is false) return new LoginResult(false);

            // Will need to instantiate a Session
            // Will need to create a refresh token
            // Will need to create an access token

            // Those three will have to be linked together
            // Session will be the parent
            // Refresh Tokens will provide Access Tokens
            // Access Tokens will provide Access to App

            // Multiple Sessions will have to be allowed to live at the same time
            // For Multiple Devices
            // Will need to Authenticate the Session based upon a few Browser Fingerprints
            // Will have to mock the Browser Fingerprints to just a basic few


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



            public async Task<LoginResult> RefreshToken(string oldRefreshToken, string ipAddress)
            {
                // Provides me with the user based on token and ipAddress
                var user = _context.Users
                    .SingleOrDefault(u => u.RefreshTokens
                    .Any(t => t.Token == oldRefreshToken
                            && t.CreatedByIp == ipAddress));

                // If conditions not met, Return Early
                if (user is null) return new LoginResult(false) { message = "No User Found" };

                // Get Current Refresh Token based on User and Refresh Token Parameter
                var currentRefreshTokenPrep = _context.Users
                    .Where(x => x == user)
                    .SelectMany(user => user.RefreshTokens
                    .Where(t => t.Token.Contains(oldRefreshToken)));
                var currentRefreshToken = currentRefreshTokenPrep.First();

                // Create new RefreshToken
                var newRefreshToken = generateRefreshToken(ipAddress);

                // Revoking previous Token
                currentRefreshToken.Revoked = DateTime.UtcNow;
                currentRefreshToken.RevokedByIp = ipAddress;
                currentRefreshToken.ReplacedByToken = newRefreshToken.Token;

                // Save the New RefreshToken to DB
                //if (user.RefreshTokens is null) { user.RefreshTokens = new List<RefreshToken>();
                user.RefreshTokens.Add(newRefreshToken);
                _context.Users.Update(user);
                _context.SaveChanges();

                // Creation of Access token
                var tokenPrep = await _jwtCreator.GetTokenAsync(user);
                var tokenToReturn = new JwtSecurityTokenHandler().WriteToken(tokenPrep);



                return new LoginResult(true) { token = tokenToReturn, refreshToken = newRefreshToken.Token };
            }



            public async Task<LoginResult> RevokeToken(string refreshTokenString, string ipAdress)
            {
                // Get the Token from the Db
                var refreshTokenEntity = _context.RefreshTokens.Select(x => x)
                    .Where(x => x.Token
                    .Equals(refreshTokenString))
                    .First();

                // Get the User from the Db
                var user = _context.Users
                    .Select(x => x)
                    .Where(x => x.RefreshTokens
                    .Any(x => x.Equals(refreshTokenEntity)));

                // From then on you revoke
                if (!refreshTokenEntity.IsActive) return new LoginResult(false);

                // Revoking the Token -- What happens to those that were not assigned this?
                refreshTokenEntity.Revoked = DateTime.UtcNow;




                return null;
            }






            /* <----------  Private Methods ----------> */
            private RefreshToken generateRefreshToken(string ipAddress)
            {
                using (var rngCryptoServiceProvider = RandomNumberGenerator.Create())
                {
                    var randomBytes = new byte[64];
                    rngCryptoServiceProvider.GetBytes(randomBytes);
                    var token = Convert.ToBase64String(randomBytes);

                    var refreshToken = new RefreshToken
                    {
                        Token = token,
                        Expires = DateTime.UtcNow.AddMinutes(5),
                        Created = DateTime.UtcNow,
                        CreatedByIp = ipAddress
                    };

                    return refreshToken;
                }
            }
    }
}