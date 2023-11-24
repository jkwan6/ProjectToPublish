using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Page : IEntityBase
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public string PageTitle { get; set; } = null!;
        public int? PageContentId { get; set; }
        public List<PageContent>? Content { get; set; }
    }
}
