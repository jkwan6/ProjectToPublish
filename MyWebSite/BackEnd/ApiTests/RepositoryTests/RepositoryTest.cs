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
        public void PagingShouldWork()
        {
            // AAA

            using (AppDbContext context = new DbSetup().getDbContext())
            {
                var x = context.Comments.Where(x => x.Id == 1).Include(x => x.ChildrenComment).Single();
                var y = x.ChildrenComment;
            }

        }
    }
}