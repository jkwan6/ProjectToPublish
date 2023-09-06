using DataLayer.Entities;
using ServiceLayer.DTO;

namespace ServiceLayer.CommentsService
{
    internal class CommentsQueryComposer : QueryComposerBase<Comments>
    {
        public CommentsQueryComposer(PageParameters pageParams) : base(pageParams) {}


        internal override IQueryable AddCustomQuery(IQueryable queryable)
        {
            IQueryable<Comments> castedQueryable = (IQueryable<Comments>)queryable;
            var queried = castedQueryable.Where(x => x.ParentId == null);
            return queried;
        }

    }

}
