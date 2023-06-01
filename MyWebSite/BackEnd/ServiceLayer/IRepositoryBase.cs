using Microsoft.AspNetCore.Mvc;
using ServiceLayer.DTO;

namespace ServiceLayer
{
    public interface IRepositoryBase<T>
    {
        Task<ActionResult<IEnumerable<T>>> GetAllAsync(PageParameters pageParams);
        Task<HttpResponseMessage> GetByIdAsync(int id);
        Task<HttpResponseMessage> PutAsync(int id, T entity);
        Task<HttpResponseMessage> PostAsync(T entity);
        Task<HttpResponseMessage> DeleteAsync(int id);
        void Save();
    }
}