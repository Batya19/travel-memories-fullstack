using System;
using Microsoft.EntityFrameworkCore;
using travelMemories.Core.Models;
using File = travelMemories.Core.Models.File;

namespace travelMemories.Data.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<File> Files { get; set; } // הוספת DbSet עבור File

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
                entity.Property(e => e.StorageQuota).HasDefaultValue(10240);
                entity.Property(e => e.AiQuota).HasDefaultValue(50);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
            });

            // File configuration
            modelBuilder.Entity<File>(entity =>
            {
                entity.HasKey(e => e.Id);
                // הגדרות נוספות עבור File
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}