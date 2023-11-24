using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.AuthenticationEntities
{
    public class AccessTokenTypeConfiguration : IEntityTypeConfiguration<AccessToken>
    {

        public void Configure(EntityTypeBuilder<AccessToken> builder)
        {
            // Naming the Table
            builder.ToTable("AccessToken");

            // Key Configuration
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).IsRequired();

            // Relationships
            builder
                .HasOne(x => x.RefreshToken)
                .WithMany(x => x.AccessTokens)
                .HasForeignKey(x => x.RefreshTokenId)
                .OnDelete(DeleteBehavior.NoAction);         // On Delete Behaviour
        }
    }
}
