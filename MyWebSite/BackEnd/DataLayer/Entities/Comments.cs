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

        public Comments()
        {
            CommentsTime = DateTime.UtcNow;
        }

        [Key]
        [Required]

        public int Id { get; set; }
        public string Author { get; set; }

        public DateTime CommentsTime;
        public string? CommentsDescription { get; set; }
        public List<SubComments>? SubComments { get; set; }
    }
}
