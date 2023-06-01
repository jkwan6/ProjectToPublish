using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTO
{
    public class PageParameters
    {
        public int PageIndex { get; set; } = 0;
        public int PageSize { get; set; } = 10;
        public string? SortColumn { get; set; }
        public string? SortOrder { get; set; }
        public string? FilterColumn { get; set; }
        public string? FilterQuery { get; set; }
    }
}
