using AuthenticationBusinessLogic.DTO;
using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServices.AuthenticationService
{
    public partial class AuthenticationService: IAuthenticationService
    {
        public async Task<SignInResultDTO> SignIn(SignInRequest signInRequest)
        {
            // Check if Email already being used
            var emailAlreadyExists = await _signInLogic.EmailExists(signInRequest);
            if (emailAlreadyExists) { return new SignInResultDTO(SignInResultDTO.PossibleResults.UserAlreadyExists); } // Early return

            // If Email not already being used, Code Continues
            var registerNewUser = await _signInLogic.RegisterNewUser(signInRequest);
            var signInResult = registerNewUser;

            // Returns DTO
            return signInResult;
        }

    }
}
