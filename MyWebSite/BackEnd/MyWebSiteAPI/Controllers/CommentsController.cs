using DataLayer.Entities;
using Microsoft.AspNetCore.Http;
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
        public async Task<ActionResult<IEnumerable<Comments>>> GetAllAsync([FromQuery] PageParameters pageParams)
        {
            var result = await _service.GetAllAsync(pageParams);
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
            comment.Id = id;
            var results = await _service.PutAsync(id, comment);
            return results;
        }

        [HttpPost]
        public async Task<HttpResponseMessage> PostAsync([FromBody] Comments comment)
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
