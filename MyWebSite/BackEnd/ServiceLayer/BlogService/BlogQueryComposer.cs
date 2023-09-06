using DataLayer.Entities;
using ServiceLayer.DTO;

namespace ServiceLayer.BlogService
{
    internal class BlogQueryComposer : QueryComposerBase<Blog>
    {
        public BlogQueryComposer(PageParameters pageParams) : base(pageParams) {}

        internal override IQueryable AddCustomQuery(IQueryable queryable)
        {
            return queryable;
        }

    }

}
