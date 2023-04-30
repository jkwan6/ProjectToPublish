using Microsoft.AspNetCore.Mvc;

namespace ServiceLayer
{
    public interface IRepositoryBase<T>
    {
        Task<ActionResult<IEnumerable<T>>> GetAllAsync();
        Task<ActionResult<T>> GetByIdAsync(int id);
        void PutAsync(T entity);
        void PostAsync(T entity);
        Task<HttpResponseMessage> DeleteAsync(int id);
        void Save();
    }
}