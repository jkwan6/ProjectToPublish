﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DataLayer.Entities;
using DataLayer.EntitiesAuth;
using System.Diagnostics.Metrics;

namespace DataLayer
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
        public DbSet<Comments> Comments { get; set; }
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<AppSession> AppSessions => Set<AppSession>();

    }
}