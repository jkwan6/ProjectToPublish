using DataLayer;
using DataLayer.Entities;
using ServiceLayer;
using ServiceLayer.CommentsService;
using ServiceLayer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiTests.RepositoryTests
{
    public class QueryComposerTests
    {

        [Fact]
        public void PropertyValidationNeedsToWork()
        {
            var comment = new Comments();
            var commentProperties = comment.GetType().GetProperties();

            var boolList = new List<bool>();
            foreach (var property in commentProperties)
            {
                var stringConvert = property.Name;
                var checkBool = QueryComposerBase<Comments>.IsValidProperty(stringConvert);
                boolList.Add((checkBool) ? true : false); 
            }

            var testSucceeded = boolList.All(c => c == true);

            Assert.True(testSucceeded);
        }


        //[Fact]
        //public void PropertyValidationNeedsToFail()
        //{
        //    var comment = new Comments();
        //    var commentProperties = new List<string>()
        //    {
        //        "test1", 
        //        "test2", 
        //        "test3"
        //    };
        //    var boolList = new List<bool>();
        //    foreach (var property in commentProperties)
        //    {
        //        var stringConvert = property;

        //        var checkBool = QueryComposer<Comments>.IsValidProperty(stringConvert);
        //        boolList.Add((checkBool) ? true : false);
        //    }

        //    var testSucceeded = boolList.All(c => c == true);

        //    Assert.False(testSucceeded);
        //}

    }
}
