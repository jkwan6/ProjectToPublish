using DataLayer.Entities;
using DataLayer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AuthenticationBusinessLogic.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AuthenticationServices.AuthenticationService;
using MyWebSiteApi.Controllers;

namespace ApiTests.AuthenticationTests
{
    public class LoginTests
    {
        // Login Story
        // User provides a username and a password
        // Username and Password get sent to API
        // Username and Password needs to be checked against Database
        // If Username and Password matches,
        // API creates App Session
        // API creates RefreshToken
        // API created AccessToken


        private readonly Mock<IAuthenticationService> _authServiceMock;
        private readonly AuthenticationController _loginController;
        private readonly Mock<HttpContext> _httpContextMock;

        public LoginTests()
        {
            _authServiceMock = new Mock<IAuthenticationService>();
            _httpContextMock = new Mock<HttpContext>();
            _loginController = new AuthenticationController(_authServiceMock.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = _httpContextMock.Object },
            };
        }

        [Fact]
        public async Task Login_Should_Return_Unauthorized_When_Login_Fails()
        {
            // Arrange
            var loginRequest = new LoginRequest { Email = "test@test.com", Password = "password" };
            var ipAddress = "192.168.0.1";

            _authServiceMock.Setup(x => x.Login(loginRequest, ipAddress))
                .ReturnsAsync(new LoginResult(false) { success = false});

            // Act
            var result = await _loginController.Login(loginRequest);

            // Assert
            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Login_Should_Return_Ok_When_Login_Succeeds()
        {
            // Arrange
            var loginRequest = new LoginRequest { Email = "test@test.com", Password = "password" };
            var ipAddress = "192.168.0.1";
            var refreshToken = "refreshToken";

            _authServiceMock.Setup(x => x.Login(loginRequest, ipAddress))
                .ReturnsAsync(new LoginResult(true) { success = true, refreshToken = refreshToken });

            // Act
            var result = await _loginController.Login(loginRequest);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var loginResult = Assert.IsType<LoginResult>(okResult.Value);
            Assert.True(loginResult.success);
            // Assert cookie related behavior here as well...
        }


    }
}
