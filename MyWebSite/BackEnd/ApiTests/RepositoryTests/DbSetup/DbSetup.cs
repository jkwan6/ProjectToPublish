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
                new Comments() { Author = "Throwaway", CommentsDescription = "Pepsi Can Coca Can", ParentId = 2},
                new Comments() { Author = "BeepBoop", CommentsDescription = "Ramen Instant Noodles"},
                new Comments() { Author = "ThreeJs", CommentsDescription = "Stuff to Write"},
                new Comments() { Author = "CommentsStuff", CommentsDescription = "Certainly! Here's a code snippet in C#"},
                new Comments() { Author = "Riley Parker", CommentsDescription = "Stuff Stuff Stuff"},
                new Comments() { Author = "Ava Collins", CommentsDescription = "One to One Relationships", ParentId = 2},
                new Comments() { Author = "Ethan Adams", CommentsDescription = "Many to Many Relationships", ParentId = 2},
                new Comments() { Author = "Lily Bennett", CommentsDescription = "c# c# c# c# c#", ParentId = 2},
                new Comments() { Author = "Noah Foster", CommentsDescription = "Random Words abcd"},
                new Comments() { Author = "Olivia Ramirez", CommentsDescription = "Stuff to write", ParentId = 2},
                new Comments() { Author = "Liam Watson", CommentsDescription = "what is this"},
                new Comments() { Author = "Emma Mitchell", CommentsDescription = "Delete this now"},
                new Comments() { Author = "Benjamin Scott", CommentsDescription = "CommentDescription1", ParentId = 2},
                new Comments() { Author = "Sophia Edwards", CommentsDescription = "CommentDescription1", ParentId = 2},
                new Comments() { Author = "Benjamin Turner", CommentsDescription = "CommentDescription1", ParentId = 2},
                new Comments() { Author = "Isabella Parker", CommentsDescription = "CommentDescription1", ParentId = 2},
                new Comments() { Author = "Ethan Evans", CommentsDescription = "CommentDescription1", ParentId = 2},
                new Comments() { Author = "Kimberly Hicks", CommentsDescription = "park"},
                new Comments() { Author = "Mohamed Rubio", CommentsDescription = "bee"},
                new Comments() { Author = "Audrey Franco", CommentsDescription = "crosswalk"},
                new Comments() { Author = "Kris Becker", CommentsDescription = "ego"},
                new Comments() { Author = "Rene Lawrence", CommentsDescription = "society"},
                new Comments() { Author = "Briana Little", CommentsDescription = "care"},
                new Comments() { Author = "Virginia Hendrix", CommentsDescription = "absolute"},
                new Comments() { Author = "Molly Ward", CommentsDescription = "keep"},
                new Comments() { Author = "Tobias Sweeney", CommentsDescription = "tension"},
                new Comments() { Author = "Leo Watson", CommentsDescription = "crouch"},
                new Comments() { Author = "Donovan Mendez", CommentsDescription = "horizon"},
                new Comments() { Author = "Willie Newton", CommentsDescription = "stereotype"},
                new Comments() { Author = "Glenn Robbins", CommentsDescription = "glass"},
                new Comments() { Author = "Gregorio Webb", CommentsDescription = "partner"},
                new Comments() { Author = "Teri Munoz", CommentsDescription = "ethics"},
                new Comments() { Author = "Amber Finley", CommentsDescription = "profit"},
                new Comments() { Author = "Tia Kaiser", CommentsDescription = "palace"},
                new Comments() { Author = "Tommie Dunlap", CommentsDescription = "abbey"},
                new Comments() { Author = "Kaye Ingram", CommentsDescription = "fool"},
                new Comments() { Author = "Marlin Armstrong", CommentsDescription = "crash"},
                new Comments() { Author = "Nicholas Oconnell", CommentsDescription = "narrow"},
                new Comments() { Author = "Xavier Baxter", CommentsDescription = "tissue"},
                new Comments() { Author = "Deborah Grimes", CommentsDescription = "slogan"},
                new Comments() { Author = "Tracy Herman", CommentsDescription = "berry"},
                new Comments() { Author = "Tim Mercado", CommentsDescription = "offer"},
                new Comments() { Author = "Jodi Mccarty", CommentsDescription = "separation"},
                new Comments() { Author = "Todd Fletcher", CommentsDescription = "kick"},
                new Comments() { Author = "Cathy Shepard", CommentsDescription = "slippery"},
                new Comments() { Author = "Wendell Wilcox", CommentsDescription = "native"},
                new Comments() { Author = "Flossie Myers", CommentsDescription = "leaf"},
                new Comments() { Author = "Nell Banks", CommentsDescription = "explode"},
                new Comments() { Author = "Juana Villa", CommentsDescription = "bare"},
                new Comments() { Author = "Andreas Holmes", CommentsDescription = "motorcycle"},
                new Comments() { Author = "Nick Morrow", CommentsDescription = "slip"},
                new Comments() { Author = "Merrill Bernard", CommentsDescription = "sex"},
                new Comments() { Author = "Fredric Byrd", CommentsDescription = "go"},
                new Comments() { Author = "Cornelius Mathis", CommentsDescription = "doctor"},
                new Comments() { Author = "Hong Dawson", CommentsDescription = "pity"},
                new Comments() { Author = "Dane Brown", CommentsDescription = "shaft"},
                new Comments() { Author = "Jeannette Farley", CommentsDescription = "consideration"},
                new Comments() { Author = "Zelma Doyle", CommentsDescription = "epicalyx"},
                new Comments() { Author = "Myra Petersen", CommentsDescription = "century"},
                new Comments() { Author = "Ken Frederick", CommentsDescription = "glue"},
                new Comments() { Author = "Charley Moses", CommentsDescription = "debut"},
                new Comments() { Author = "Earl Terrell", CommentsDescription = "distance"},
                new Comments() { Author = "Herb Compton", CommentsDescription = "exploration"},
                new Comments() { Author = "Dallas Bush", CommentsDescription = "cup"},
                new Comments() { Author = "Von Crane", CommentsDescription = "tidy"},
                new Comments() { Author = "Marcellus David", CommentsDescription = "tiger"},
                new Comments() { Author = "Hollie Preston", CommentsDescription = "junior"},



            };

            context.Comments.AddRange(comments);

            context.SaveChanges();

            return context;
        }

    }
}
