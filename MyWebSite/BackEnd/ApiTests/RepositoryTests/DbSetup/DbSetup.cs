using DataLayer;
using DataLayer.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.CommentsService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiTests.RepositoryTests.DbSetup
{
    public class DbSetup
    {
        public AppDbContext getDbContext()
        {
            // AAA
            var connectionStringBuilder = new SqliteConnectionStringBuilder { DataSource = ":memory:" };
            var connection = new SqliteConnection(connectionStringBuilder.ToString());
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(connection)
                .Options;

            AppDbContext context = new AppDbContext(options);

            context.Database.OpenConnection();
            context.Database.EnsureCreated();

            IEnumerable<Comments> comments = new List<Comments>()
            {
                new Comments() { Author = "Pepsi", CommentsDescription = "Comment Description Random Values"},
                new Comments() { Author = "CocaCola", CommentsDescription = "AspNetCore Description"},
                new Comments() { Author = "Zinger", CommentsDescription = "AngularMaterial"},
                new Comments() { Author = "FishAndChips", CommentsDescription = "Theming"},
                new Comments() { Author = "Spotify", CommentsDescription = "Value1Value2Value3Value4Value5"},
                new Comments() { Author = "CommentsRep", CommentsDescription = "Will Need to learn Blender", ParentId = 1},
                new Comments() { Author = "Name1", CommentsDescription = "Tax Taste No Sugar", ParentId = 1},
                new Comments() { Author = "Name3", CommentsDescription = "NBB Sucks Ass", ParentId = 1},
                new Comments() { Author = "Throwaway", CommentsDescription = "Pepsi Can Coca Can"},
                new Comments() { Author = "BeepBoop", CommentsDescription = "Ramen Instant Noodles"},
                new Comments() { Author = "ThreeJs", CommentsDescription = "Stuff to Write"},
                new Comments() { Author = "CommentsStuff", CommentsDescription = "Certainly! Here's a code snippet in C#"},
                new Comments() { Author = "Riley Parker", CommentsDescription = "Stuff Stuff Stuff"},
                new Comments() { Author = "Ava Collins", CommentsDescription = "One to One Relationships"},
                new Comments() { Author = "Ethan Adams", CommentsDescription = "Many to Many Relationships"},
                new Comments() { Author = "Lily Bennett", CommentsDescription = "c# c# c# c# c#"},
                new Comments() { Author = "Noah Foster", CommentsDescription = "Random Words abcd"},
                new Comments() { Author = "Olivia Ramirez", CommentsDescription = "Stuff to write"},
                new Comments() { Author = "Liam Watson", CommentsDescription = "what is this"},
                new Comments() { Author = "Emma Mitchell", CommentsDescription = "Delete this now"},
                new Comments() { Author = "Benjamin Scott", CommentsDescription = "CommentDescription1"},
                new Comments() { Author = "Sophia Edwards", CommentsDescription = "CommentDescription1"},
                new Comments() { Author = "Benjamin Turner", CommentsDescription = "CommentDescription1"},
                new Comments() { Author = "Isabella Parker", CommentsDescription = "CommentDescription1"},
                new Comments() { Author = "Ethan Evans", CommentsDescription = "CommentDescription1"},



            };

            context.Comments.AddRange(comments);

            context.SaveChanges();

            return context;
        }

    }
}
