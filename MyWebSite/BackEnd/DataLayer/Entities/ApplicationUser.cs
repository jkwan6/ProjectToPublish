using DataLayer.AuthenticationEntities;
using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace DataLayer.Entities
{
    public class ApplicationUser : IdentityUser
    {
        [JsonIgnore] public List<RefreshToken> RefreshTokens { get; set; }
        [JsonIgnore] public List<AppSession> AppSessions { get; set; }
    }
}