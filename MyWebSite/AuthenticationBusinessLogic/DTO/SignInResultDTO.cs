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
        public enum PossibleResults
        {
            UserAlreadyExists,
            InvalidPasswordOrEmail,
            LoginSuccessful,
            Failed
        }

        public SignInResult(PossibleResults possibleResults)
        {
            switch(possibleResults)
            {
                case PossibleResults.InvalidPasswordOrEmail:
                    success = false;
                    message = "Invalid Email of Password";
                    break;
                case PossibleResults.LoginSuccessful:
                    success = true;
                    message = "Login Successful";
                    break;
                case PossibleResults.UserAlreadyExists:
                    success = false;
                    message = "User Already Exists";
                    break;
                case PossibleResults.Failed:
                    success = false;
                    message = "SignIn Failed";
                    break;
                default:
                    success = false;
                    message = "Retry Signing In";
                    break;
            }
        }

        public bool success { get; set; }
        public string message { get; set; } = null!;
        public string? token { get; set; }


        [JsonIgnore] // Will Not be Sent Via the Return Body --> Will be send in a cookie
        public string? refreshToken { get; set; }
    }
}
