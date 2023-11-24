using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Comments: IEntityBase
    {
        [Key]
        [Required]
        public int Id { get; set; }
        public string? Author { get; set; }
        public DateTime CommentsTime { get; set;}
        public string? CommentsDescription { get; set; }

        public int? ParentId { get; set; }
        public Comments? ParentComment { get; set; }

        public List<Comments>? ChildrenComment { get; set; }
    }
}
