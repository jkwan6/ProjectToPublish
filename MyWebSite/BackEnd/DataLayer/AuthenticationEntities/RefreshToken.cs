using System.ComponentModel.DataAnnotations;
using DataLayer.Entities;

namespace DataLayer.AuthenticationEntities
{
    public class RefreshToken
    {
        public RefreshToken(ApplicationUser user)
        {
            User = user;
            Expires = DateTime.UtcNow.AddSeconds(60);
            Created = DateTime.UtcNow;
        }

        public RefreshToken() {}

        // Properties
        [Key][Required] public int Id { get; set; }
        public string Token { get; set; } = null!;
        public DateTime Expires { get; set; }
        public DateTime? Created { get; set; }
        public string? CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        public string? RevokedByIp { get; set; }
        public string? ReplacedByToken { get; set; }

        // Method Properties
        public bool IsActive => Revoked is null && !IsExpired;
        public bool IsExpired => DateTime.UtcNow >= Expires;


        // <-- Relationships --> //


        // Parent Relationships
        public AppSession AppSession { get; set; } = null!;
        public int AppSessionId { get; set; }

        public ApplicationUser User { get; set; } = null!;
        public string ApplicationUserId { get; set; } = null!;

        // Child Relationship
        public List<AccessToken> AccessTokens { get; set; } = null!;
    }
}
