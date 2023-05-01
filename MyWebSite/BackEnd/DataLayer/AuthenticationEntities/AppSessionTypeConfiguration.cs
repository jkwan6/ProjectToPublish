using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.AuthenticationEntities
{
    public class AppSessionTypeConfiguration : IEntityTypeConfiguration<AppSession>
    {

        public void Configure(EntityTypeBuilder<AppSession> builder)
        {
            // Naming the Table
            builder.ToTable("AppSessions");

            // Key Configuration
            builder.HasKey(x => x.AppSessionId);
            builder.Property(x => x.AppSessionId).IsRequired();

            // Relationships
            builder
                .HasOne(x => x.User)
                .WithMany(x => x.AppSessions)
                .HasForeignKey(x => x.ApplicationUserId)
                .OnDelete(DeleteBehavior.NoAction);         // On Delete Behaviour
        }
    }
}
