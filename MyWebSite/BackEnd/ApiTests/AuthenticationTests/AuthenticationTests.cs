﻿using DataLayer.Entities;
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

namespace ApiTests.AuthenticationTests
{
    public class AuthenticationTests
    {

        [Fact]
        public async void AuthenticationCheck()
        {
            var context = new AppDbContext();
            var userManager = TestUserManager<ApplicationUser>();

            var usertest = new ApplicationUser()
            {
                Email = "test",
                Id = "1"
            };
            var mock = new Mock<UserManager<ApplicationUser>>();
            mock.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(new ApplicationUser { 
                    Email = "teste",
                    Id = "1"
                });

            mock.Setup(x => x.FindByNameAsync("x")).Returns(Task.FromResult(usertest));
            var user = await mock.Object.FindByNameAsync("x");
        }

        public static UserManager<TUser> TestUserManager<TUser>(IUserStore<TUser> store = null) where TUser : class
        {
            store = store ?? new Mock<IUserStore<TUser>>().Object;
            var options = new Mock<IOptions<IdentityOptions>>();
            var idOptions = new IdentityOptions();
            idOptions.Lockout.AllowedForNewUsers = false;
            options.Setup(o => o.Value).Returns(idOptions);
            var userValidators = new List<IUserValidator<TUser>>();
            var validator = new Mock<IUserValidator<TUser>>();
            userValidators.Add(validator.Object);
            var pwdValidators = new List<PasswordValidator<TUser>>();
            pwdValidators.Add(new PasswordValidator<TUser>());
            var userManager = new UserManager<TUser>(store, options.Object, new PasswordHasher<TUser>(),
                userValidators, pwdValidators, new UpperInvariantLookupNormalizer(),
                new IdentityErrorDescriber(), null,
                new Mock<ILogger<UserManager<TUser>>>().Object);
            validator.Setup(v => v.ValidateAsync(userManager, It.IsAny<TUser>()))
                .Returns(Task.FromResult(IdentityResult.Success)).Verifiable();
            return userManager;
        }

    }
}