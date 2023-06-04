using ApiTests.RepositoryTests.DbSetup;
using DataLayer;
using DataLayer.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
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
        public async void DbSetShouldOnlyLoadParentEntities()
        {
            // AAA
            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var dbSet = context.Set<Comments>();

            }

        }

        //[Fact]
        //public async void ShouldReturnOneEntity()
        //{
        //    // AAA
        //    using (AppDbContext context = new DbSetup().getDbContext())
        //    {
        //        var repo = new CommentsRepository(context);

        //        var entityId = 5;

        //        var entity = await repo.GetByIdAsync(entityId);
        //        var test = entity.Content;
        //        Assert.NotNull(test);


        //        Assert.True(authorCheck && descriptionCheck);
        //    }

        //}

    }
}