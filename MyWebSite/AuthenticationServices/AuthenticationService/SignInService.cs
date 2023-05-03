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
        public async Task<AuthenticationBusinessLogic.DTO.SignInResult> SignIn(SignInRequest signInRequest)
        {
            var email = signInRequest.Email;
            var password = signInRequest.Password;

            var emailAlreadyExists = await _signInLogic.EmailExists(email);
            if (emailAlreadyExists) { return new SignInResult(SignInResult.PossibleResults.UserAlreadyExists); } // Early return

            // If User Doesnt Exists, Code Continues
            var registerNewUser = await _signInLogic.RegisterNewUser(SignInRequest)();

            var newUser = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                Email = email
            };

        }

    }
}
