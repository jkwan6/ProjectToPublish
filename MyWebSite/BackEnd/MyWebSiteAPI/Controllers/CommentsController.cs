using DataLayer.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.CommentsService;
using ServiceLayer.DTO;
using SQLitePCL;

namespace MyWebSiteApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : Controller
    {
        #region Properties
        private readonly CommentsService _service;
        #endregion

        #region Constructor
        public CommentsController(CommentsService service)
        {
            _service = service;
        }
        #endregion
        [HttpGet]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<ActionResult<IEnumerable<Comments>>> GetAllAsync([FromQuery] PageParameters pageParams)
        {
            var result = await _service.GetAllAsync(pageParams);
            var parsedResult = result.Content.ReadAsAsync<PagedObjectsDTO<Comments>>();
            var parsedObjects = parsedResult.Result;

            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)result.StatusCode;
            return objectResult;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Comments>> GetByIdAsync(int id)
        {
            var result = await _service.GetByIdAsync(id);
            var parsedResult = result.Content.ReadAsAsync<Comments>();
            var parsedObjects = parsedResult.Result;

            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)result.StatusCode;
            return objectResult;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Comments>> PutAsync(int id, Comments comment)
        {
            comment.Id = id;    // Will Override ID set in comments Body if 2 id provided.
            var result = await _service.PutAsync(id, comment);

            var parsedResult = result.Content.ReadAsAsync<Comments>();
            var parsedObjects = parsedResult.Result;

            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)result.StatusCode;
            return objectResult;
        }

        [HttpPost]
        [Authorize(Roles = "RegisteredUser")]
        public async Task<ActionResult<Comments>> PostAsync([FromBody] Comments comment)
        {
            var user = User.Identity!.Name;
            comment.Author = user;
            var results = await _service.PostAsync(comment);
            var parsedResults = results.Content.ReadAsAsync<Comments>();

            // Nothing in parsedObjects, but could potentially return the posted entity
            var parsedObjects = parsedResults.Result;
            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)results.StatusCode;
            return objectResult;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Comments>> DeleteAsync(int id)
        {
            var results = await _service.DeleteAsync(id);
            var objectResult = new ObjectResult(null);
            objectResult.StatusCode = (int)results.StatusCode;
            return objectResult;
        }
    }
}
