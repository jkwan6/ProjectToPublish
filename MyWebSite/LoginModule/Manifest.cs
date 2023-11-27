using OrchardCore.Modules.Manifest;

[assembly: Module(
    Name = "Login Module",
    Author = "Kevin",
    Version = "0.0.1",
    Description = "Login Module",
    Category = "Login",
    Dependencies = new[] {  "OrchardCore.Users", "OrchardCore.Features", "OrchardCore.Settings" }
)]