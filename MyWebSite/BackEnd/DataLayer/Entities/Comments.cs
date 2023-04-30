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
    public new int Id { get; set; }
    public DateTime CommentsTime => DateTime.UtcNow;
    public string? CommentsDescription { get; set; }
    }
}
