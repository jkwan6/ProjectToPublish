using AuthenticationServices.BusinessLogic;
using DataLayer.Entities;
using DataLayer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AuthenticationBusinessLogic.DTO;
using Microsoft.EntityFrameworkCore.SqlServer.Storage.Internal;

namespace AuthenticationBusinessLogic.SignInLogic
{
    public class SignInLogic
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public SignInLogic(
            AppDbContext context,
            UserManager<ApplicationUser> userManager,
            JwtCreatorLogic jwtCreator)
        {
            _context = context;
            _userManager = userManager;
        }


        public async Task<bool> EmailExists(string email)
        {
            var userExists = await _userManager.FindByEmailAsync(email);    // Return Null if doesnt exist

            if (userExists == null) { return false; } else { return true; }
        }

        public async Task<SignInResultDTO> RegisterNewUser(SignInRequest signInRequest)
        {
            var email = signInRequest.Email;
            var password = signInRequest.Password;
            var newUser = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                Email = email
            };

            var registeringProcess = await _userManager.CreateAsync(newUser, password);
            var registerSuccess = registeringProcess.Succeeded;

            var signInResult = 
                (registerSuccess)
                ? new SignInResultDTO(SignInResultDTO.PossibleResults.Failed) 
                : new SignInResultDTO(SignInResultDTO.PossibleResults.Failed);

            return signInResult;
        }

    }
}
