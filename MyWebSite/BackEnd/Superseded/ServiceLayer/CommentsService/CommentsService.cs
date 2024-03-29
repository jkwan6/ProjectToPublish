﻿using DataLayer.Entities;
using ServiceLayer.DTO;

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

        public async Task<HttpResponseMessage> PutAsync(int id, Comments comment)
        {
            comment.CommentsTime = DateTime.UtcNow;
            var results = await _repository.PutAsync(id, comment);
            return results!;
        }

        public async Task<HttpResponseMessage> PostAsync(Comments comment)
        {
            comment.CommentsTime = DateTime.UtcNow;
            var results = await _repository.PostAsync(comment);
            return results!;
        }

        public async Task<HttpResponseMessage> DeleteAsync(int id)
        {
            var result = await _repository.DeleteAsync(id);
            return result;
        }
    }
}
