using System.ComponentModel.DataAnnotations;

namespace AuthenticationBusinessLogic.DTO
{
    public class SignInRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Email Confirmation is required.")]
        public string confirmEmail { get; set; } = null!;

        [Required(ErrorMessage = "Password Confirmation is required.")]
        public string confirmPassword { get; set; } = null!;
    }
}
