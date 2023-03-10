using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjectDbDomain.Entities;

namespace ProjectDbData
{
    public class AppDbContext: IdentityDbContext<ApplicationUser>
    {
        //public AppDbContext() : base()
        //{
        //}

        // Will use the Ctor of the base class with parameters = DbContexOptions
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // add the EntityTypeConfiguration classes
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
                );
        }

    }
}