using ServiceLayer.DTO;

namespace ServiceLayer
{
    public interface IRepositoryBase<T>
    {
        Task<HttpResponseMessage> GetAllAsync(PageParameters pageParams);
        Task<HttpResponseMessage> GetByIdAsync(int id);
        Task<HttpResponseMessage> PutAsync(int id, T entity);
        Task<HttpResponseMessage> PostAsync(T entity);
        Task<HttpResponseMessage> DeleteAsync(int id);
        void Save();
    }
}