using DataLayer.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.CommentsService;

namespace MyWebSiteApi.Controllers
{
    [Route("[controller]")]
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
        public async Task<ActionResult<IEnumerable<Comments>>> GetAllAsync()
        {
            var result = await _service.GetAllAsync();
            return result;
        }

        [HttpGet("{id}")]
        public async Task<HttpResponseMessage> GetByIdAsync(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result;
        }

        [HttpPut("{id}")]
        public async Task<HttpResponseMessage> PutAsync(int id, Comments comment)
        {
            var results = await _service.PutAsync(id, comment);
            return results;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> PostAsync(Comments comment)
        {
            var results = await _service.PostAsync(comment);
            return results;
        }

        [HttpDelete("{id}")]
        public async Task<HttpResponseMessage> DeleteAsync(int id)
        {
            var response = await _service.DeleteAsync(id);
            return response;
        }
    }
}
