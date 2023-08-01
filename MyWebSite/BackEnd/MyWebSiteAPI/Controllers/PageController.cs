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
    public class PageController : Controller
    {

        #region Properties
        private readonly CommentsService _service;
        #endregion

        #region Constructor
        public PageController(CommentsService service)
        {
            _service = service;
        }
        #endregion
        [HttpGet]
        //[Authorize(Roles = "RegisteredUser")]
        public async Task<ActionResult<IEnumerable<Comments>>> GetAllAsync([FromQuery] PageParameters pageParams)
        {
            var result = await _service.GetAllAsync(pageParams);
            var parsedResult = result.Content.ReadAsAsync<PagedObjectsDTO<Comments>>();
            var parsedObjects = parsedResult.Result;

            var objectResult = new ObjectResult(parsedObjects);
            objectResult.StatusCode = (int)result.StatusCode;
            return objectResult;
        }




    }
}
