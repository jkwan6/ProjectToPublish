using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataLayer.AuthenticationEntities
{
    public class RefreshTokenTypeConfiguration : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.ToTable("RefreshToken");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id).IsRequired();

            // Relationships

            builder
                .HasOne(x => x.User)
                .WithMany(x => x.RefreshTokens)
                .HasForeignKey(x => x.ApplicationUserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder
                .HasOne(x => x.AppSession)
                .WithMany(x => x.RefreshTokens)
                .HasForeignKey(x => x.AppSessionId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
