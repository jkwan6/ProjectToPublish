using Microsoft.AspNetCore.Mvc;
using AuthenticationServices.AuthenticationService;
using DataLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DataLayer;
using AuthenticationBusinessLogic.DTO;
using AuthenticationBusinessLogic.SignInLogic;

namespace MyWebSiteApi.Controllers
{
    public partial class AuthenticationController : Controller
    {

        // CONSTRUCTOR IN OTHER PARTIAL CLASS

        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest signInRequest)
        {
            string role_RegisteredUser = "RegisteredUser";
            string? ipAd = ipAdress();

            if (await _roleManager.FindByNameAsync(role_RegisteredUser) == null)                // Check if Default Dont Exist Yet
                await _roleManager.CreateAsync(new IdentityRole(role_RegisteredUser));

            var addedUserList = new List<ApplicationUser>();                                    // Create a List To Track Newly Added Users
            var email = signInRequest.Email;

            if (await _userManager.FindByNameAsync(email) == null)
            {
                var user = new ApplicationUser()                                                // Create a New Admin ApplicationUser Account
                {
                    SecurityStamp = Guid.NewGuid().ToString(),                                  // Instantiation
                    UserName = email,                                                           // Instantiation
                    Email = email,                                                              // Instantiation
                };

                // insert the admin user into the DB
                var results = await _userManager.CreateAsync(user, signInRequest.Password);
                await _userManager.AddToRoleAsync(user, role_RegisteredUser);                   // Assign "RegisteredUser" Role

                user.EmailConfirmed = true;                                                     // Confirm Email
                user.LockoutEnabled = false;                                                    // Remove Lockout

                addedUserList.Add(user);                                                        // Add Admin User to UserList

                if (addedUserList.Count > 0)
                    await _context.SaveChangesAsync();
            }


            return NoContent();
        }

    }
}
