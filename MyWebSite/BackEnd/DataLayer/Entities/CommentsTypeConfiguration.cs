using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
        public class CommentsTypeConfiguration : IEntityTypeConfiguration<Comments>
        {
            public void Configure(EntityTypeBuilder<Comments> builder)
            {
                builder.ToTable("Comments");

                builder.HasKey(x => x.Id);

                builder.Property(x => x.Id).IsRequired();

                // Relationships

                builder
                    .HasOne(x => x.ParentComment)
                    .WithMany(x => x.ChildrenComment)
                    .HasForeignKey(x => x.ParentId)
                    .OnDelete(DeleteBehavior.NoAction);
            }
        }
}
