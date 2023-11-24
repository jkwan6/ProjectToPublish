using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AuthenticationBusinessLogic.DTO
{
    public class RefreshResult
    {
        enum PossibleOutcomes
        {
            SessionExpired
        }


        public string message { get; set; }
        public string? accessToken { get; set; }
        [JsonIgnore] // Will Not be Sent Via the Return Body --> Will be send in a cookie
        public string? refreshToken { get; set; }
    }
}
