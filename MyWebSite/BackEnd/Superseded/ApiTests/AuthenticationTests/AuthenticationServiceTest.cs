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
using AuthenticationServices.AuthenticationService;
using MyWebSiteApi.Controllers;
using AuthenticationBusinessLogic.DTO;
using AuthenticationBusinessLogic;
using Castle.Core.Configuration;
using Microsoft.Extensions.Configuration;
using AuthenticationBusinessLogic.RefreshLogic;

namespace ApiTests.AuthenticationTests
{
    public class AuthenticationServiceTest
    {

        [Fact]
        public async void AuthenticationCheck()
        {
            // Arrange Configuration
            var appSettings = @"{""JwtSettings"": {
                    ""SecurityKey"": ""Test1"",
                    ""Issuer"": ""Test2"",
                    ""Audience"": ""Test3"",
                    ""ExpirationTimeInMinutes"": Test4}}";
            var builder = new ConfigurationBuilder();
            builder.AddJsonStream(new MemoryStream(Encoding.UTF8.GetBytes(appSettings)));
            var configuration = builder.Build();

            // Arrange UserManager
            var userMock = new ApplicationUser{ Email = "test", Id = "1" };
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            userStoreMock.Setup(x => x.FindByIdAsync("1",CancellationToken.None)).ReturnsAsync(userMock);
            var userManagerMock = new UserManager<ApplicationUser>(userStoreMock.Object, null, null, null, null, null, null, null, null);

            // Arrange jwtCreator
            var jwtCreaterLogic = new JwtCreatorLogic(configuration, userManagerMock);


        }


        [Fact]
        public async void TokenMatches()
        {
            // Arrange Configuration
            var appSettings = @"{""JwtSettings"": {
                    ""SecurityKey"": ""Test1"",
                    ""Issuer"": ""Test2"",
                    ""Audience"": ""Test3"",
                    ""ExpirationTimeInMinutes"": Test4}}";
            var builder = new ConfigurationBuilder();
            builder.AddJsonStream(new MemoryStream(Encoding.UTF8.GetBytes(appSettings)));
            var configuration = builder.Build();

            // Arrange UserManager
            var userMock = new ApplicationUser { Email = "test", Id = "1" };
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            userStoreMock.Setup(x => x.FindByIdAsync("1", CancellationToken.None)).ReturnsAsync(userMock);
            var userManagerMock = new UserManager<ApplicationUser>(userStoreMock.Object, null, null, null, null, null, null, null, null);

            // Arrange jwtCreator
            var jwtCreaterLogic = new JwtCreatorLogic(configuration, userManagerMock);
        }


    }
}
