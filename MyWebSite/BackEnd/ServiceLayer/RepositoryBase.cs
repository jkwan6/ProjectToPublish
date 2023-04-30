using DataLayer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        #region Properties
        private readonly AppDbContext _context = null!;
        private DbSet<T> table = null!;
        #endregion

        #region Constructor
        public RepositoryBase(AppDbContext context)
        {
            _context = context; // Choosing the EFCore Persistence
            table = _context.Set<T>(); // Generic Table
        }
        #endregion


        public async Task<ActionResult<IEnumerable<T>>> GetAllAsync()
        {
            var result = await table.ToListAsync();
            return result;
        }

        public async Task<ActionResult<T>> GetByIdAsync(int id)
        {
            var result = await table.FindAsync(id);
            return result;
        }

        public void PutAsync(T entity)
        {
            table.Add(entity);
        }

        public void PostAsync(T entity)
        {
            table.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }

        public async Task<HttpResponseMessage> DeleteAsync(int id)
        {
            var existing = await table.FindAsync(id);
            if (existing == null)
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            table.Remove(existing);
            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
