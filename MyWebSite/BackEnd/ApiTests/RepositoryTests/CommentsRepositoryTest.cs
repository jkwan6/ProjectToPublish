using ApiTests.RepositoryTests.DbSetup;
using DataLayer;
using DataLayer.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using ServiceLayer;
using ServiceLayer.CommentsService;
using ServiceLayer.DTO;

namespace ApiTests
{
    public class CommentsRepositoryTest
    {
        [Fact]
        public async void ShouldReturnSomething()
        {
            // AAA

            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var repo = new CommentsRepository(context);

                var pageParams = new PageParameters()
                {
                    PageSize = 10,
                    PageIndex = 0,
                    //FilterColumn = "Author",
                    //FilterQuery = "a",
                    //SortColumn = "Author",
                    //SortOrder = "ASC"
                };

                var x = await repo.GetAllAsync(pageParams);
                var y = x.Value.Count();

                Assert.NotEqual(0, y);
            }

        }

        [Fact]
        public async void QueryShouldFail()
        {
            // AAA

            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var commentsRepository = new RepositoryBase<Comments>(context);

                var commentsService = new CommentsService(commentsRepository);
                var pageParams = new PageParameters()
                {
                    FilterColumn = "545454",
                    FilterQuery = "545454",
                    PageIndex = 43,
                    PageSize = 2,
                    SortColumn = "545454",
                    SortOrder = "545454",
                };
                var entity = await commentsService.GetAllAsync(pageParams);


            }

        }

        [Fact]
        public async void ShouldAddEntity()
        {
            // AAA
            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var repo = new CommentsRepository(context);

                var comment = new Comments
                {
                    Author = "Random",
                    CommentsDescription = "Random"
                };

                await repo.PostAsync(comment);

                var entity = context.Comments.Where(x => x.CommentsDescription == "Random").First();

                var authorCheck = (entity.Author == "Random") ? true : false;
                var descriptionCheck = (entity.CommentsDescription == "Random") ? true : false;

                Assert.True(authorCheck && descriptionCheck);
            }

        }


        [Fact]
        // This works but because of making the DbContext AsNoTracking
        public async void DbSetShouldOnlyLoadParentEntities()  
        {
            // AAA
            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var dbSet = context.Set<Comments>();

            }

        }

        [Fact]
        public async void ConvertHttpResponseMessageToEntity()
        {
            // AAA

            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var commentsRepository = new RepositoryBase<Comments>(context);

                var commentsService = new CommentsService(commentsRepository);
                var entity = await commentsService.GetByIdAsync(1);
                var test = entity.Content.ReadAsAsync<Comments>();
                var y = test.Result;


                Assert.True(y is Comments);
            }

        }

    }
}