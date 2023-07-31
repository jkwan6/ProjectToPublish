using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DataLayer.Entities;
using DataLayer.AuthenticationEntities;
using System.Diagnostics.Metrics;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DataLayer
{
    public class AppDbContext: IdentityDbContext<ApplicationUser>
    {
        // Ctor 1
        public AppDbContext() : base()
        {
        }

        // Ctor 2
        // Will use the Ctor of the base class with parameters = DbContexOptions
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            // Will send the Options to Initialize the DbContext from the Unit Method Directly
            
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // add the EntityTypeConfiguration classes
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
                );
        }
        public DbSet<Comments> Comments => Set<Comments>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<AppSession> AppSessions => Set<AppSession>();
        public DbSet<AccessToken> AccessTokens => Set<AccessToken>();
        public DbSet<Page> Pages => Set<Page>();
        public DbSet<PageContent> PageContents => Set<PageContent>();


    }
}