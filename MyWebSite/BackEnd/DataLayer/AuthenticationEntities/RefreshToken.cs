using System.ComponentModel.DataAnnotations;
using DataLayer.Entities;

namespace DataLayer.AuthenticationEntities
{
    public class RefreshToken
    {
        public RefreshToken(ApplicationUser user)
        {
            User = user;
            Expires = DateTime.UtcNow.AddDays(1);
            Created = DateTime.UtcNow;
        }


        // Properties
        [Key][Required] public int Id { get; set; }
        public string Token { get; set; }

        public readonly DateTime Expires;

        public readonly DateTime? Created;

        public string? CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        public string? RevokedByIp { get; set; }
        public string? ReplacedByToken { get; set; }

        // Method Properties
        public bool IsActive => Revoked is null && !IsExpired;
        public bool IsExpired => DateTime.UtcNow >= Expires;


        // <-- Relationships --> //


        // Parent Relationships
        public AppSession AppSession { get; set; }
        public int AppSessionId { get; set; }

        public ApplicationUser User { get; set; }
        public string ApplicationUserId { get; set; }
    }
}
