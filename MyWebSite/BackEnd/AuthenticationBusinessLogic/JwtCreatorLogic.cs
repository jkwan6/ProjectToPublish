using DataLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthenticationBusinessLogic
{

    public class JwtCreatorLogic
    {
        #region Properties
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        #endregion

        #region Constructor
        public JwtCreatorLogic(IConfiguration config, UserManager<ApplicationUser> userManager)
        {
            _config = config;
            _userManager = userManager;
        }
        #endregion

        #region Public Methods
        // Method to create Tokens.  Calls the Private Method beneath
        public async Task<JwtSecurityToken> GetTokenAsync(ApplicationUser user)
        {
            var jwtOptions = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: await GetClaimsAsync(user, _userManager),
                expires: DateTime.UtcNow.AddSeconds(10),
                signingCredentials: GetSigningCredentials()
                );

            return jwtOptions;
        }
        #endregion

        #region Private Methods
        // Method To Create a Key and then Creating Signing Credentials from the Key
        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecurityKey"]!);
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        // Method to Create the User Claims to be placed in the JWT
        private async Task<List<Claim>> GetClaimsAsync
            (ApplicationUser user,
            UserManager<ApplicationUser> userManager)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email)
            };

            foreach (var role in await userManager.GetRolesAsync(user))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }
        #endregion
    }
}
