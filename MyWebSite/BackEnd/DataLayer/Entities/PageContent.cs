using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class PageContent : IEntityBase
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public string? Content { get; set; }
    }
}
