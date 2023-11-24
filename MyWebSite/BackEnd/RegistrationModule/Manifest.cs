using OrchardCore.Modules.Manifest;

[assembly: Module(
    Name = "Registration Module",
    Author = "Kevin",
    Version = "0.0.1",
    Description = "Registration Module",
    Category = "Registration",
    Dependencies = new[] {  "OrchardCore.Users", "OrchardCore.Features", "OrchardCore.Settings" }
)]