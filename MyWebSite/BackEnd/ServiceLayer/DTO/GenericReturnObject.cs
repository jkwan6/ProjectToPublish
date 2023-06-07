using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTO
{
    public class GenericReturnObject<T>
    {
        public List<T>? Objects { get; set; }
        public int Count { get; set; }
    }
}
