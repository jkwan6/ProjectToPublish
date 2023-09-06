using DataLayer;
using DataLayer.Entities;

namespace ServiceLayer.PageService
{
    public class PageRepository: RepositoryBase<Page>
    {
        private AppDbContext _appDbContext;

        public PageRepository(AppDbContext appDbContext) : base(appDbContext)
        {
            _appDbContext = appDbContext;
        }
    }
}
