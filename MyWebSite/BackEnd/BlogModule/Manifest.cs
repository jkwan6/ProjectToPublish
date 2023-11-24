using OrchardCore.Modules.Manifest;

[assembly: Module(
    Name = "Blog Module",
    Author = "Kevin",
    Version = "0.0.1",
    Description = "Blog Module",
    Category = "Blog",
    Dependencies = new[] {  "OrchardCore.Alias", "OrchardCore.Autoroute", "OrchardCore.ContentFields", "OrchardCore.ContentManagement", "OrchardCore.Markdown", "OrchardCore.Media", "OrchardCore.Taxonomies", "OrchardCore.Title", "OrchardCore.List" }
)]