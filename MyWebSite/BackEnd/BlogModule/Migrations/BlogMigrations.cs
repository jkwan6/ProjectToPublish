using BlogModule.Models;
using OrchardCore.Alias.Models;
using OrchardCore.Autoroute.Models;
using OrchardCore.ContentFields.Fields;
using OrchardCore.ContentFields.Settings;
using OrchardCore.ContentManagement;
using OrchardCore.ContentManagement.Metadata;
using OrchardCore.ContentManagement.Metadata.Settings;
using OrchardCore.Data.Migration;
using OrchardCore.Markdown.Models;
using OrchardCore.Markdown.Settings;
using OrchardCore.Media.Fields;
using OrchardCore.Media.Settings;
using OrchardCore.Taxonomies.Fields;
using OrchardCore.Taxonomies.Models;
using OrchardCore.Taxonomies.Settings;
using OrchardCore.Title.Models;

namespace BlogModule.Migrations
{
    public class BlogMigrations: DataMigration
    {
        private readonly IContentDefinitionManager _contentDefinitionManager;
        private readonly IContentManager _contentManager;


        public BlogMigrations(IContentDefinitionManager contentDefinitionManager, IContentManager contentManager)
        {
            _contentDefinitionManager = contentDefinitionManager;
            _contentManager = contentManager;
        }


        public int Create()
        {

            var tagId = CreateTags();
            var categoryId = CreateCategories();

            _contentDefinitionManager.AlterPartDefinition(
                nameof(Blog),
                part => {
                    part.Attachable();
                    part.WithField(
                            nameof(Blog.Subtitle),
                            field => field
                                    .OfType(nameof(TextField))
                                    .WithDisplayName(nameof(Blog.Subtitle)));

                    part.WithField(
                            nameof(Blog.BannerImage),
                            field => field
                                    .OfType(nameof(MediaField))
                                    .WithDisplayName(nameof(Blog.BannerImage))
                                    .WithSettings(new MediaFieldSettings
                                    {
                                        AllowAnchors = true,
                                        Multiple = false,
                                        Required = false,
                                        AllowMediaText = true,
                                    }));

                    part.WithField(
                            nameof(Blog.Tags),
                            field => field
                                    .OfType(nameof(TaxonomyField))
                                    .WithDisplayName(nameof(Blog.Tags))
                                    .WithSettings(new TaxonomyFieldSettings
                                    {
                                        Required = false,
                                        Unique = false,
                                        LeavesOnly = false,
                                        Open = true,
                                        TaxonomyContentItemId = tagId
                                    })
                                    .WithEditor("Tags")
                                    .WithDisplayMode("Tags"));

                    part.WithField(
                            nameof(Blog.Category),
                            field => field
                                    .OfType(nameof(TaxonomyField))
                                    .WithDisplayName(nameof(Blog.Category))
                                    .WithSettings(new TaxonomyFieldSettings
                                    {   
                                        Required = false,
                                        Unique = true,
                                        LeavesOnly = true,
                                        Open = false,
                                        TaxonomyContentItemId = categoryId,
                                    }));
                });


            _contentDefinitionManager.AlterTypeDefinition(
                "Blog",
                type => type
                        .Creatable()
                        .Listable()
                        .Draftable()
                        .Versionable()
                        .Securable()
                        .WithPart("TitlePart")
                        .WithPart("AutoroutePart",
                            part => part.WithSettings(new AutoroutePartSettings
                            {
                                AllowCustomPath = true,
                                AllowUpdatePath = false,
                                ShowHomepageOption = false,
                                AllowDisabled = false,
                                AllowAbsolutePath = false,
                                ManageContainedItemRoutes = true,
                                AllowRouteContainedItems = false,
                                Pattern = "{{ Model.ContentItem | display_text | slugify }}"
                            }))
                            .WithPart(nameof(MarkdownBodyPart),
                            part => part.WithSettings(new MarkdownBodyPartSettings
                            {
                                SanitizeHtml = true,
                            }).WithEditor("Wysiwyg"))
                        .WithPart(nameof(Blog)));

            return 1;
        }


        private string CreateTags()
        {
            _contentDefinitionManager.AlterTypeDefinition(
                "Tag",
                type => type
                        .WithPart(
                            "TitlePart",
                            part => part.WithSettings(new TitlePartSettings
                            {
                                Options = TitlePartOptions.Editable,
                                RenderTitle = true,
                                Pattern = ""
                            })));

            _contentDefinitionManager.AlterTypeDefinition(
                "Tag",
                type => type
                        .WithPart(
                            "AutoroutePart",
                            part => part.WithSettings(new AutoroutePartSettings
                            {
                                AllowCustomPath = true,
                            AllowUpdatePath = false,
                            ShowHomepageOption = false,
                            AllowDisabled = false,
                            AllowAbsolutePath = false,
                            ManageContainedItemRoutes = true,
                            AllowRouteContainedItems = false,
                            Pattern = "{{ Model.ContentItem | display_text | slugify }}"
                        })));

            var contentItem = _contentManager.NewAsync("Taxonomy").Result;

            var taxonomyPart = contentItem.As<TaxonomyPart>();
            taxonomyPart.TermContentType = "Tag";
            taxonomyPart.Apply();

            var titlePart = contentItem.As<TitlePart>();
            titlePart.Title = "Tags";
            titlePart.Apply();

            var aliasPart = contentItem.As<AliasPart>();
            aliasPart.Alias = "tags";
            aliasPart.Apply();

            var autoRoutePart = contentItem.As<AutoroutePart>();
            autoRoutePart.Path = "tags";
            autoRoutePart.RouteContainedItems = true;
            autoRoutePart.Apply();

            _contentManager.CreateAsync(contentItem).Wait();

            return contentItem.ContentItemId;
        }

        private string CreateCategories()
        {
            _contentDefinitionManager.AlterPartDefinition(
                "Category",
                part => {
                    part.Attachable();
                    part.WithField(
                            "Icon",
                            field => field
                                    .OfType(nameof(TextField))
                                    .WithDisplayName("Icon")
                                    .WithSettings(new TextFieldSettings
                                    {
                                        Required = true
                                    }).WithEditor("IconPicker"));
                });

            _contentDefinitionManager.AlterTypeDefinition(
                "Category",
                type => type
                        .WithPart(
                            "TitlePart",
                            part => part.WithSettings(new TitlePartSettings
                            {
                                Options = TitlePartOptions.Editable,
                                RenderTitle = true,
                                Pattern = ""
                            })));

            _contentDefinitionManager.AlterTypeDefinition(
                "Category",
                type => type
                        .WithPart(
                            "AutoroutePart",
                            part => part.WithSettings(new AutoroutePartSettings
                            {
                                AllowCustomPath = true,
                                AllowUpdatePath = false,
                                ShowHomepageOption = false,
                                AllowDisabled = false,
                                AllowAbsolutePath = false,
                                ManageContainedItemRoutes = true,
                                AllowRouteContainedItems = false,
                                Pattern = "{{ Model.ContentItem | display_text | slugify }}"
                            })));

            _contentDefinitionManager.AlterTypeDefinition(
                "Category",
                type => type
                        .WithPart("Category"));

            var contentItem = _contentManager.NewAsync("Taxonomy").Result;

            var taxonomyPart = contentItem.As<TaxonomyPart>();
            taxonomyPart.TermContentType = "Category";
            taxonomyPart.Apply();

            var titlePart = contentItem.As<TitlePart>();
            titlePart.Title = "Categories";
            titlePart.Apply();

            var aliasPart = contentItem.As<AliasPart>();
            aliasPart.Alias = "categories";
            aliasPart.Apply();

            var autoRoutePart = contentItem.As<AutoroutePart>();
            autoRoutePart.Path = "categories";
            autoRoutePart.RouteContainedItems = true;
            autoRoutePart.Apply();

            _contentManager.CreateAsync(contentItem).Wait();

            return contentItem.ContentItemId;
        }

    }
}
