using DataLayer.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer.BlogService;
using ServiceLayer.DTO;

namespace MyWebSiteApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        #region Properties
        private readonly BlogService _service;
        #endregion

        #region Constructor
        public BlogController(BlogService service)
        {
            _service = service;
        }
        #endregion
        [HttpGet]
        //[Authorize(Roles = "RegisteredUser")]
        public async Task<ActionResult<IEnumerable<Blog>>> GetAllAsync([FromQuery] PageParameters pageParams)
        {
            var result = await _service.GetAllAsync(pageParams);
            var parsedResult = result.Content.ReadAsAsync<PagedObjectsDTO<Blog>>();
            var parsedObjects = parsedResult.Result;

            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)result.StatusCode;
            return objectResult;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Blog>> GetByIdAsync(int id)
        {
            var result = await _service.GetByIdAsync(id);
            var parsedResult = result.Content.ReadAsAsync<Blog>();
            var parsedObjects = parsedResult.Result;

            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)result.StatusCode;
            return objectResult;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Blog>> PutAsync(int id, Blog blog)
        {
            blog.Id = id;    // Will Override ID set in comments Body if 2 id provided.
            var result = await _service.PutAsync(id, blog);

            var parsedResult = result.Content.ReadAsAsync<Blog>();
            var parsedObjects = parsedResult.Result;

            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)result.StatusCode;
            return objectResult;
        }

        [HttpPost]
        //[Authorize(Roles = "RegisteredUser")]
        public async Task<ActionResult<Blog>> PostAsync([FromBody] Blog blog)
        {
            var user = User.Identity!.Name;
            blog.Author = user;
            var results = await _service.PostAsync(blog);
            var parsedResults = results.Content.ReadAsAsync<Blog>();

            // Nothing in parsedObjects, but could potentially return the posted entity
            var parsedObjects = parsedResults.Result;
            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)results.StatusCode;
            return objectResult;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Blog>> DeleteAsync(int id)
        {
            var results = await _service.DeleteAsync(id);
            var objectResult = new ObjectResult(null);
            objectResult.StatusCode = (int)results.StatusCode;
            return objectResult;
        }

    }
}
