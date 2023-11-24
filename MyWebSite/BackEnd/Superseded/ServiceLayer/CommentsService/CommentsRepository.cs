using DataLayer.Entities;
using System.Net;
using DataLayer;
using ServiceLayer.DTO;
using System.Linq.Dynamic.Core;
using System.Net.Http.Formatting;

namespace ServiceLayer.CommentsService
{
    public class CommentsRepository : RepositoryBase<Comments>
    {

        private readonly AppDbContext _appDbContext;

        // Constructor
        public CommentsRepository(AppDbContext appDbContext) : base(appDbContext)
        {
            _appDbContext = appDbContext;
        }


        public override async Task<HttpResponseMessage> GetAllAsync(PageParameters pageParams)
        {
            var queryComposer = new CommentsQueryComposer(pageParams);
            var resultTuple = queryComposer.BuildQuery(table);
            var resultObject = resultTuple.Item1;
            var resultCount = resultTuple.Item2;

            var result = await resultObject.ToDynamicListAsync<Comments>();


            if (result is null) return new HttpResponseMessage(HttpStatusCode.NotFound);    // Early Return

            var count = resultCount;
            var objectToReturn = new PagedObjectsDTO<Comments>()
            {
                Objects = result,
                Count = count
            };

            var response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new ObjectContent<PagedObjectsDTO<Comments>>(objectToReturn, new JsonMediaTypeFormatter());
            return response;
        }
    }
}
