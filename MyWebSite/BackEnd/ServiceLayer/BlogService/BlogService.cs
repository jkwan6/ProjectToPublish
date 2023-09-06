using DataLayer;
using DataLayer.Entities;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.BlogService
{
    public class BlogService
    {
        private readonly IRepositoryBase<Blog> _repository;
        // Constructor
        public BlogService(IRepositoryBase<Blog> repository)
        {
            _repository = repository;
        }

        public async Task<HttpResponseMessage> GetAllAsync(PageParameters pageParams)
        {
            var results = await _repository.GetAllAsync(pageParams);
            return results;
        }

        public async Task<HttpResponseMessage> GetByIdAsync(int id)
        {
            var results = await _repository.GetByIdAsync(id);
            return results;
        }

        public async Task<HttpResponseMessage> PutAsync(int id, Blog blog)
        {
            blog.BlogTime = DateTime.UtcNow;
            var results = await _repository.PutAsync(id, blog);
            return results!;
        }

        public async Task<HttpResponseMessage> PostAsync(Blog blog)
        {
            blog.BlogTime = DateTime.UtcNow;
            var results = await _repository.PostAsync(blog);
            return results!;
        }

        public async Task<HttpResponseMessage> DeleteAsync(int id)
        {
            var result = await _repository.DeleteAsync(id);
            return result;
        }
    }
}
