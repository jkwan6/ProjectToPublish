using Microsoft.AspNetCore.Mvc;
using AuthenticationServices.AuthenticationService;
using AuthenticationServices.DTO;
using DataLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DataLayer;

namespace MyWebSiteApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignInController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IAuthenticationService _authService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public SignInController(
            AppDbContext context,
            IAuthenticationService authService,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _authService = authService;
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }


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
                var user = new ApplicationUser()                                          // Create a New Admin ApplicationUser Account
                {
                    SecurityStamp = Guid.NewGuid().ToString(),                                  // Instantiation
                    UserName = email,                                                           // Instantiation
                    Email = email,                                                              // Instantiation
                };

                // insert the admin user into the DB
                var results = await _userManager.CreateAsync(user, signInRequest.Password);
                await _userManager.AddToRoleAsync(user, role_RegisteredUser);             // Assign "RegisteredUser" Role

                user.EmailConfirmed = true;                                               // Confirm Email
                user.LockoutEnabled = false;                                              // Remove Lockout

                addedUserList.Add(user);                                                  // Add Admin User to UserList

                if (addedUserList.Count > 0)
                    await _context.SaveChangesAsync();
            }


            return NoContent();
        }

        private string? ipAdress()
        {
            if (this.Request.Headers.ContainsKey("X-Forwarded-For"))
                return this.Request.Headers["X-Forwarded-For"];
            else
                // Will convert IPV6 to IPV4. Will keep IPV4 to IPV4
                return this.HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
        }
    }
}
