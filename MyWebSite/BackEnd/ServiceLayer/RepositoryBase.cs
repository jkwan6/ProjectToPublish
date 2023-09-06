using DataLayer;
using DataLayer.Entities;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.DTO;
using System.Linq.Dynamic.Core;
using System.Net;
using System.Net.Http.Formatting;

namespace ServiceLayer
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : IEntityBase
    {
        #region Properties
        private readonly AppDbContext _context = null!;
        internal DbSet<T> table = null!;
        #endregion

        #region Constructor
        public RepositoryBase(AppDbContext context)
        {
            _context = context; // Choosing the EFCore Persistence
            table = _context.Set<T>(); // Generic Table
        }
        #endregion

        #region GetAll
        public virtual async Task<HttpResponseMessage> GetAllAsync(PageParameters pageParams)
        {
            var queryComposer = new QueryComposerBase<T>(pageParams);
            var resultTuple = queryComposer.BuildQuery(table);
            var resultObjects = resultTuple.Item1;
            var resultCount = resultTuple.Item2;

            var result = await resultObjects.ToDynamicListAsync<T>();
            if (result is null) return new HttpResponseMessage(HttpStatusCode.NotFound);    // Early Return

            var count = resultCount;
            var objectToReturn = new PagedObjectsDTO<T>()
            {
                Objects = result,
                Count = count
            };

            var response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new ObjectContent<PagedObjectsDTO<T>>(objectToReturn, new JsonMediaTypeFormatter());
            return response;
        }
        #endregion

        #region GetById
        public async Task<HttpResponseMessage> GetByIdAsync(int id)
        {
            var result = await table.FindAsync(id);

            if (result is null) return new HttpResponseMessage(HttpStatusCode.NotFound);

            var response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new ObjectContent<T>(result, new JsonMediaTypeFormatter());
            return response;
        }
        #endregion

        #region PutAsync
        public async Task<HttpResponseMessage> PutAsync(int id, T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntityExists(id))
                {
                    return new HttpResponseMessage(HttpStatusCode.NotFound);
                }
                else
                {
                    throw;
                }
            }
            var response = new HttpResponseMessage(HttpStatusCode.OK);
            var entityToReturn = await table.FindAsync(id);
            response.Content = new ObjectContent<T>(entityToReturn, new JsonMediaTypeFormatter());
            return response;
        }
        #endregion

        #region PostAsync
        public async Task<HttpResponseMessage> PostAsync(T entity)
        {
            table.Add(entity);
            await _context.SaveChangesAsync();
            return new HttpResponseMessage(HttpStatusCode.Created);
        }
        #endregion

        #region DeleteAsync
        public async Task<HttpResponseMessage> DeleteAsync(int id)
        {
            var existing = await table.FindAsync(id);
            if (existing == null)
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            table.Remove(existing);
            await _context.SaveChangesAsync();
            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
        #endregion

        #region InternalMethods
        public void Save()
        {
            _context.SaveChanges();
        }
        private bool EntityExists(int id)
        {
            return table.Any(e => e.Id == id);
        }
        #endregion
    }
}
