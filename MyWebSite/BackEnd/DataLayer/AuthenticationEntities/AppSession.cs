using DataLayer.Entities;
using System.ComponentModel.DataAnnotations;

namespace DataLayer.AuthenticationEntities
{
    public class AppSession
    {
        // Properties
        [Key][Required] public int AppSessionId { get; set; }
        public string CreatedByIp { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Expires { get; set; }
        public string UserFingerprint { get; set; }
        public DateTime? Revoked { get; set; }

        // Method Properties
        public bool IsActive => Revoked is null && !IsExpired;      // If not revoked or not expired
        public bool IsExpired => DateTime.UtcNow >= Expires;        // If Time now is greater than Expires Time

        // <-- Relationships --> //
        //// Parent Relationship One-to-Many
        public ApplicationUser User { get; set; }                   // Navigation Prop
        public string ApplicationUserId { get; set; }               // Foreign Key

        //// Child Relationship One-to-Many
        public List<RefreshToken> RefreshTokens { get; set; }       // List of Many Tokens
    }
}

