using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using DataLayer;
using DataLayer.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using ServiceLayer.CommentsService;
using ServiceLayer;
using AuthenticationServices.AuthenticationService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using AuthenticationBusinessLogic.LoginLogic;
using AuthenticationBusinessLogic;
using AuthenticationBusinessLogic.SignInLogic;
using AuthenticationBusinessLogic.RefreshLogic;

var builder = WebApplication.CreateBuilder(args);

//////// <--- INFRASTRUCTURE SERVICE ---> //////////

// CONTROLLER CONFIGS
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        //options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
// DBCONTEXT CONFIGS
builder.Services.AddDbContext<AppDbContext>(options =>
    options
    .UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))   // Options sent to the constructor of the DbContext
    .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Query.Name })
    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));                   // No tracking by default

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AngularPolicy",

        cfg =>
        {
            cfg.SetIsOriginAllowed(origin => true);
            cfg.AllowCredentials();
            cfg.AllowAnyHeader();
            cfg.AllowAnyMethod();
            cfg.WithOrigins(builder.Configuration["AllowedCORS"]);
        });
});

// PASSWORD CONFIGS
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequiredLength = 1;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;

}).AddEntityFrameworkStores<AppDbContext>();

// JWT CONFIGS
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        RequireExpirationTime = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecurityKey"]))
    };
});

////////////////////////////////////////////////////


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DI CONTAINER
builder.Services.AddScoped<AppDbContext>();
builder.Services.AddScoped<IRepositoryBase<Comments>, CommentsRepository>();
builder.Services.AddScoped<CommentsService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<LoginLogic>();
builder.Services.AddScoped<SignInLogic>();
builder.Services.AddScoped<RefreshLogic>();
builder.Services.AddScoped<JwtCreatorLogic>();

var app = builder.Build();

//////// <--- MIDDLEWARE PIPELINE ---> //////////
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Check Up Above for Angular Policy CORS
app.UseCors("AngularPolicy");

app.MapControllers();

app.Run();
