using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using OrchardCore.Data.Migration;
using OrchardCore.Environment.Shell;
using OrchardCore.Modules;
using OrchardCore.Users;
using RegistrationModule.Migration;

namespace RegistrationModule
{
    public class Startup: StartupBase
    {
        public override void Configure(IApplicationBuilder builder, IEndpointRouteBuilder routes, IServiceProvider serviceProvider)
        {
            builder.UseCors(
            options => options.WithOrigins("https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
            
            //builder.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllers();
            //});
        }

        public override void ConfigureServices(IServiceCollection services)
        {
            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredUniqueChars = 3;
                options.Password.RequiredLength = 6;
            });
            //services.AddCors(options =>
            //{
            //    options.AddPolicy("CorsPolicy", builder =>
            //    {
            //        builder.WithOrigins("https://localhost:4200")
            //               .AllowAnyHeader()
            //               .AllowAnyMethod()
            //               .AllowCredentials();
            //    });
            //});
            services.AddScoped<UserManager<IUser>, UserManager<IUser>>();
            services.AddScoped<IDataMigration, RegistrationMigration>();
            services.AddScoped<IShellFeaturesManager, ShellFeaturesManager>();
        }
    }
}