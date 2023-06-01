using ApiTests.RepositoryTests.DbSetup;
using DataLayer;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.CommentsService;

namespace ApiTests
{
    public class RepositoryTest
    {
        [Fact]
        public async void PagingShouldWork()
        {
            // AAA

            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var repo = new CommentsRepository(context);


                var x = await repo.GetAllAsync();
                var y = x.Value.Count();

                Assert.NotEqual(0, y);
            }

        }
    }
}