using Microsoft.AspNetCore.Mvc;

namespace ServiceLayer
{
    public interface IRepositoryBase<T>
    {
        Task<ActionResult<IEnumerable<T>>> GetAllAsync();
        Task<HttpResponseMessage> GetByIdAsync(int id);
        Task<HttpResponseMessage> PutAsync(int id, T entity);
        Task<HttpResponseMessage> PostAsync(T entity);
        Task<HttpResponseMessage> DeleteAsync(int id);
        void Save();
    }
}