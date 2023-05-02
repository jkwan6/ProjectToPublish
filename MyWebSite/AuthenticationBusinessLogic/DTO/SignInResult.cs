using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AuthenticationBusinessLogic.DTO
{
    public class SignInResult
    {
        public SignInResult(bool param)
        {
            if (param is false)
            {
                success = false;
                message = "Invalid Email or Password.";
            }
            else
            {
                success = true;
                message = "Login Successful";
            }
        }

        public bool success { get; set; }
        public string message { get; set; } = null!;
        public string? token { get; set; }


        [JsonIgnore] // Will Not be Sent Via the Return Body --> Will be send in a cookie
        public string? refreshToken { get; set; }
    }
}
