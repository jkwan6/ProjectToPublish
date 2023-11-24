using OrchardCore.ContentFields.Fields;
using OrchardCore.ContentManagement;
using OrchardCore.Media.Fields;
using OrchardCore.Taxonomies.Fields;

namespace BlogModule.Models
{
    public class Blog : ContentPart
    {
        public TextField Subtitle { get; set; }
        public MediaField BannerImage { get; set; }
        public TaxonomyField Tags { get; set; }
        public TaxonomyField Category { get; set; }
    }
}
