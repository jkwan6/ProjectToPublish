using DataLayer.Entities;
using DataLayer;
using ServiceLayer.DTO;
using System.Net.Http.Formatting;
using System.Net;
using System.Linq.Dynamic.Core;

namespace ServiceLayer.BlogService
{
    public class BlogRepository : RepositoryBase<Blog>
    {
        private readonly AppDbContext _appDbContext;
        // Constructor
        public BlogRepository(AppDbContext appDbContext) : base(appDbContext)
        {
            _appDbContext = appDbContext;
        }

    }
}