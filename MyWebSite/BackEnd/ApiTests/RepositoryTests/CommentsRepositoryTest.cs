using ApiTests.RepositoryTests.DbSetup;
using DataLayer;
using DataLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using ServiceLayer;
using ServiceLayer.CommentsService;
using ServiceLayer.DTO;
using System.Net;

namespace ApiTests
{
    public class CommentsRepositoryTest
    {
        [Fact]
        public async void GetAllShouldReturnSomething()
        {
            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var repo = new CommentsRepository(context);

                var pageParams = new PageParameters()
                { 
                    PageSize = 10, PageIndex = 0, 
                    FilterColumn = "Author", FilterQuery = "a", 
                    SortColumn = "Author", SortOrder = "ASC" 
                };

                var x = await repo.GetAllAsync(pageParams);
                var y = x.Content.ReadAsAsync <PagedObjectsDTO<Comments>>();
                var z = y.Result.Objects;
                var test = new ObjectResult(z);
                test.StatusCode = (int)x.StatusCode;
            }
        }

        [Fact]
        public void GetAllShouldOnlyLoadParentEntities()
        {
            // This works but because of making the DbContext AsNoTracking
            // Doesnt work in Unit Tests
        }

        [Fact]
        public async void ShouldAddEntity()
        {
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
        public async void ExtractObjectFromHttpResponseMessage()
        {
            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var commentsRepository = new RepositoryBase<Comments>(context);
                var commentsService = new CommentsService(commentsRepository);
                var httpMessage = await commentsService.GetByIdAsync(1);
                var httpMessageContent = httpMessage.Content.ReadAsAsync<Comments>();
                var entity = httpMessageContent.Result;

                Assert.True(entity is Comments);
            }
        }

        [Fact]
        public async void PostSomething()
        {
            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var repo = new CommentsRepository(context);
                var comment = new Comments()
                {
                    Author = "striung",
                    CommentsDescription = "string"
                };

                var x = await repo.PostAsync(comment);
                var y = x.Content.ReadAsAsync<Comments>();
                var z = y.Result;
                var test = new ObjectResult(z);
                test.StatusCode = (int)x.StatusCode;
            }
        }

        [Fact]
        public async void DeleteSomething()
        {
            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var repo = new CommentsRepository(context);
                var id = 10;
                var x = await repo.DeleteAsync(id);
                //var y = x.Content.ReadAsAsync<HttpResponseMessage>();
                //var z = y.Result;
                var test = new ObjectResult(null);
                test.StatusCode = (int)x.StatusCode;
            }
        }


    }
}