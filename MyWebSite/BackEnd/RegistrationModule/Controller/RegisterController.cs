using OrchardCore.Users;
using OrchardCore.Users.Controllers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using OrchardCore.Settings;
using Microsoft.Extensions.Logging;
using OrchardCore.Entities;
using OrchardCore.Users.Models;
using OrchardCore.Users.ViewModels;
using OrchardCore.ContentManagement;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace RegistrationModule.Controller
{
    [Route("api/[controller]")]
    //[EnableCors("CorsPolicy")]
    public partial class RegisterController : Microsoft.AspNetCore.Mvc.Controller
    {
        private readonly UserManager<IUser> _userManager;
        private readonly ISiteService _siteService;
        private readonly ILogger _logger;

        public RegisterController(
            UserManager<IUser> userManager,
            ISiteService siteService,
            ILogger<RegistrationController> logger)
        {
            _userManager = userManager;
            _siteService = siteService;
            _logger = logger;
        }
        [HttpPost("Register")]
        //[AllowAnonymous]
        [IgnoreAntiforgeryToken]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            var settings = (await _siteService.GetSiteSettingsAsync()).As<RegistrationSettings>();

            if (settings.UsersCanRegister != UserRegistrationType.AllowRegistration)
            {
                return NotFound();
            }

            if (String.IsNullOrEmpty(model.Email))
            {
                return BadRequest("Email is required");
            }

            if (ModelState.IsValid)
            {
                // Check if user with same email already exists
                var userWithEmail = await _userManager.FindByEmailAsync(model.Email);

                if (userWithEmail != null)
                {
                    return BadRequest("A user with the same email already exists.");
                }
            }

            if (ModelState.IsValid)
            {
                var iUser = await this.RegisterUser(model, "Confirm your account", _logger);
                if (iUser == null)
                {
                    return BadRequest(ModelState);
                };

                return Ok(ModelState);

            }
            return BadRequest(ModelState);
        }
    }
}
