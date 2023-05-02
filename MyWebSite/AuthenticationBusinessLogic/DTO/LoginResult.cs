using System.Text.Json.Serialization;

namespace AuthenticationBusinessLogic.DTO
{
    public class LoginResult
    {
        public LoginResult(bool param)
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


        [JsonIgnore] // Will Not be Sent Via the Return Body
        public string refreshToken { get; set; }
    }
}
