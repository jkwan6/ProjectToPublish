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
            var emailAlreadyExists = await _signInLogic.EmailExists(signInRequest);
            if (emailAlreadyExists) { return new SignInResultDTO(SignInResultDTO.PossibleResults.UserAlreadyExists); } // Early return

            // If User Doesnt Exists, Code Continues
            var registerNewUser = await _signInLogic.RegisterNewUser(signInRequest);
            var signInResult = registerNewUser;

            return signInResult;
        }

    }
}
