using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Blog : IEntityBase
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public string? Author { get; set; }
        public DateTime BlogTime { get; set; }
        public byte[]? BlogThumbnail { get; set; }
        public string BlogBody { get; set; } = null!;
        public string BlogTitle { get; set; } = null!;
    }
}
