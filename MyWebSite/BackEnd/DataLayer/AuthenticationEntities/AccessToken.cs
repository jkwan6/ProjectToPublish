using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.AuthenticationEntities
{
    public class AccessToken
    {
        public AccessToken(RefreshToken refreshToken)
        {
            RefreshToken = refreshToken;
        }

        public AccessToken() {}

        // Properties
        [Key][Required] public int Id { get; set; }
        public string Token { get; set; } = null!;


        // <-- Relationships --> //

        // Parent Relationships
        public RefreshToken RefreshToken { get; set; } = null!;
        public int RefreshTokenId { get; set; }
    }
}
