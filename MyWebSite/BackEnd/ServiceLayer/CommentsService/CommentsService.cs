using DataLayer;
using DataLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.CommentsService
{
    public class CommentsService
    {
        private readonly IRepositoryBase<Comments> _repository;
        // Constructor
        public CommentsService(IRepositoryBase<Comments> repository)
        {
            _repository = repository;
        }

        public async Task<ActionResult<IEnumerable<Comments>>> GetAllAsync()
        {
            var results = await _repository.GetAllAsync();
            return results;
        }

        public async Task<ActionResult<Comments>> GetByIdAsync(int id)
        {
            var results = await _repository.GetByIdAsync(id);
            return results;
        }

        public void PutAsync(Comments comment)
        {
            _repository.PutAsync(comment);
        }

        public void PostAsync(Comments comment)
        {
            _repository.PostAsync(comment);
        }

        public async Task<IActionResult> DeleteAsync(int id)
        {
            var response = await _repository.DeleteAsync(id);
            var result = new ObjectResult(response.Content);
            return result;
        }

        public void Save()
        {
            _repository.Save();
        }
    }
}
