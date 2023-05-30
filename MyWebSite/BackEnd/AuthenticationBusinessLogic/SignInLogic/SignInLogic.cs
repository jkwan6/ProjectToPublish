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
    public enum Roles
    {
        RegisteredUser
    }

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

        public async Task<bool> EmailExists(SignInRequest signInRequest)
        {
            var email = signInRequest.Email;

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
                Email = email,
                UserName = email
            };

            var registeringProcess = await _userManager.CreateAsync(newUser, password);
            await _userManager.AddToRoleAsync(newUser, Roles.RegisteredUser.ToString());
            var registerSuccess = registeringProcess.Succeeded;

            newUser.EmailConfirmed = true;                                                     // Confirm Email
            newUser.LockoutEnabled = false;                                                    // Remove Lockout

            var signInResult = 
                (registerSuccess)
                ? new SignInResultDTO(SignInResultDTO.PossibleResults.SignInSuccessful) 
                : new SignInResultDTO(SignInResultDTO.PossibleResults.Failed);

            if (registerSuccess) { await _context.SaveChangesAsync(); }

            return signInResult;
        }

    }
}
