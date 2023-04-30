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
        public async Task<ActionResult<Comments>> GetByIdAsync(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result;
        }

        [HttpPut]
        public void PutAsync(Comments comment)
        {
            _service.PutAsync(comment);
            _service.Save();
        }

        [HttpPost]
        public void PostAsync(Comments comment)
        {
            _service.PostAsync(comment);
            _service.Save();
        }




        // Put

        // Post

        // Delete



    }
}
