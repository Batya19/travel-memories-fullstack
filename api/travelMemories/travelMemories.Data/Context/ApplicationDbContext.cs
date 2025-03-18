using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using travelMemories.Core.Models;
using File = travelMemories.Core.Models.File;

namespace travelMemories.Data.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<File> Files { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<FileTag> FileTags { get; set; }
        public DbSet<Collage> Collages { get; set; }
        public DbSet<CollageFile> CollageFiles { get; set; }
        public DbSet<AIImage> AIImages { get; set; }
        public DbSet<TripPoint> TripPoints { get; set; }
        public DbSet<PointFile> PointFiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure composite keys
            modelBuilder.Entity<FileTag>()
                .HasKey(ft => new { ft.FileId, ft.TagId });

            modelBuilder.Entity<CollageFile>()
                .HasKey(cf => new { cf.CollageId, cf.FileId });

            modelBuilder.Entity<PointFile>()
                .HasKey(pf => new { pf.PointId, pf.FileId });

            // Configure relationships
            modelBuilder.Entity<FileTag>()
                .HasOne(ft => ft.File)
                .WithMany(f => f.FileTags)
                .HasForeignKey(ft => ft.FileId);

            modelBuilder.Entity<FileTag>()
                .HasOne(ft => ft.Tag)
                .WithMany(t => t.FileTags)
                .HasForeignKey(ft => ft.TagId);

            modelBuilder.Entity<CollageFile>()
                .HasOne(cf => cf.Collage)
                .WithMany(c => c.CollageFiles)
                .HasForeignKey(cf => cf.CollageId);

            modelBuilder.Entity<CollageFile>()
                .HasOne(cf => cf.File)
                .WithMany(f => f.CollageFiles)
                .HasForeignKey(cf => cf.FileId);

            modelBuilder.Entity<PointFile>()
                .HasOne(pf => pf.TripPoint)
                .WithMany(tp => tp.PointFiles)
                .HasForeignKey(pf => pf.PointId);

            modelBuilder.Entity<PointFile>()
                .HasOne(pf => pf.File)
                .WithMany(f => f.PointFiles)
                .HasForeignKey(pf => pf.FileId);

            modelBuilder.Entity<AIImage>()
            .HasOne(ai => ai.File)
                .WithOne(f => f.AIImage)
                .HasForeignKey<AIImage>(ai => ai.FileId);

            // Configure other entity properties
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.PasswordHash)
                .HasMaxLength(255)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.FirstName)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.LastName)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Trip>()
                .Property(t => t.Name)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<File>()
                .Property(f => f.FileName)
                .HasMaxLength(255)
                .IsRequired();

            modelBuilder.Entity<File>()
                .Property(f => f.FilePath)
                .HasMaxLength(255)
                .IsRequired();

            modelBuilder.Entity<File>()
                .Property(f => f.FileType)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<File>()
                .Property(f => f.MimeType)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Tag>()
                .Property(t => t.Name)
                .HasMaxLength(50)
                .IsRequired();

            modelBuilder.Entity<Collage>()
                .Property(c => c.Name)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<Collage>()
                .Property(c => c.ThumbnailUrl)
                .HasMaxLength(255);

            modelBuilder.Entity<TripPoint>()
                .Property(tp => tp.Name)
                .HasMaxLength(100)
                .IsRequired();
        }
    }
}