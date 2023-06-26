using DataLayer;
using AuthenticationBusinessLogic.DTO;
using AuthenticationBusinessLogic.LoginLogic;
using AuthenticationBusinessLogic.SignInLogic;
using AuthenticationBusinessLogic.RefreshLogic;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationServices.AuthenticationService
{
    public partial class AuthenticationService: IAuthenticationService
    {

        #region Properties
        private readonly AppDbContext _context;
        private readonly LoginLogic _loginLogic;
        private readonly SignInLogic _signInLogic;
        private readonly RefreshLogic _refreshLogic;
        #endregion

        #region Constructor
        public AuthenticationService(
            AppDbContext context,
            LoginLogic loginLogic,
            SignInLogic signInLogic,
            RefreshLogic refreshLogic)
            {
                _context = context;
                _loginLogic = loginLogic;
                _signInLogic = signInLogic;
                _refreshLogic = refreshLogic;
            }
        #endregion

        // Login Method - Returns JWT and Refresh Token
        public async Task<LoginResult> Login(LoginRequest loginRequest, string ipAddress)
        {
            var username = loginRequest.Email;
            var password = loginRequest.Password;

            var authenticateUserTuple = await _loginLogic.UserAuthentication(username, password);    // Returns a Tuple

            if (authenticateUserTuple.Item1 is false) return new LoginResult(false);                 // Fail --> Early Return
            var userId = authenticateUserTuple.Item2;                                                // Succeed --> get Id

            // Continue Authentication
            var session = await _loginLogic.CreateSession(userId!, ipAddress);
            var refreshToken = await _loginLogic.CreateRefreshToken(userId!, session, ipAddress);
            var accessToken = await _loginLogic.CreateAccessToken(userId!, refreshToken, ipAddress);
            
            #region To Do List
            // Those three will have to be linked together
            // Session will be the parent
            // Refresh Tokens will provide Access Tokens
            // Access Tokens will provide Access to App

            // Multiple Sessions will have to be allowed to live at the same time
            // For Multiple Devices
            // Will need to Authenticate the Session based upon a few Browser Fingerprints
            // Will have to mock the Browser Fingerprints to just a basic few
            #endregion

            // Assigning Token to Login Result
            var loginResult = new LoginResult(true)
            { 
                token = accessToken.Token, 
                refreshToken = refreshToken.Token 
            };

            return loginResult;
        }



        #region UnComment
        //public async Task<LoginResult> RefreshToken(string oldRefreshToken, string ipAddress)
        //{
        //    //// Provides me with the user based on token and ipAddress
        //    //var user = _context.Users
        //    //    .SingleOrDefault(u => u.RefreshTokens
        //    //    .Any(t => t.Token == oldRefreshToken
        //    //            && t.CreatedByIp == ipAddress));

        //    //// If conditions not met, Return Early
        //    //if (user is null) return new LoginResult(false) { message = "No User Found" };

        //    //// Get Current Refresh Token based on User and Refresh Token Parameter
        //    //var currentRefreshTokenPrep = _context.Users
        //    //    .Where(x => x == user)
        //    //    .SelectMany(user => user.RefreshTokens
        //    //    .Where(t => t.Token.Contains(oldRefreshToken)));
        //    //var currentRefreshToken = currentRefreshTokenPrep.First();

        //    //// Create new RefreshToken
        //    //var newRefreshToken = generateRefreshToken(ipAddress);

        //    //// Revoking previous Token
        //    //currentRefreshToken.Revoked = DateTime.UtcNow;
        //    //currentRefreshToken.RevokedByIp = ipAddress;
        //    //currentRefreshToken.ReplacedByToken = newRefreshToken.Token;

        //    //// Save the New RefreshToken to DB
        //    ////if (user.RefreshTokens is null) { user.RefreshTokens = new List<RefreshToken>();
        //    //user.RefreshTokens.Add(newRefreshToken);
        //    //_context.Users.Update(user);
        //    //_context.SaveChanges();

        //    //// Creation of Access token
        //    //var tokenPrep = await _jwtCreator.GetTokenAsync(user);
        //    //var tokenToReturn = new JwtSecurityTokenHandler().WriteToken(tokenPrep);



        //    //return new LoginResult(true) { token = tokenToReturn, refreshToken = newRefreshToken.Token };
        //}
        #endregion

        #region RevokeToken
        public async Task<LoginResult> RevokeToken(string refreshTokenString, string ipAdress)
        {
            // Get the Token from the Db
            var refreshTokenEntity = await _context.RefreshTokens
                .Select(x => x)
                .Where(x => x.Token
                .Equals(refreshTokenString))
                .FirstAsync();

            // Get the User from the Db
            var user = await _context.Users
                .Select(x => x)
                .Where(x => x.RefreshTokens!
                .Any(x => x.Equals(refreshTokenEntity)))
                .FirstOrDefaultAsync();

            // From then on you revoke
            if (!refreshTokenEntity.IsActive) return new LoginResult(false);

            // Revoking the Token -- What happens to those that were not assigned this?
            refreshTokenEntity.Revoked = DateTime.UtcNow;

            _context.SaveChanges();

            return null;
        }
        #endregion





    }
}