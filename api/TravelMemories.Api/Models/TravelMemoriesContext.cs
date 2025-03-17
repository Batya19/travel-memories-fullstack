using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TravelMemories.Api.Models;

public partial class TravelMemoriesContext : DbContext
{
    public TravelMemoriesContext()
    {
    }

    public TravelMemoriesContext(DbContextOptions<TravelMemoriesContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AiImage> AiImages { get; set; }

    public virtual DbSet<Collage> Collages { get; set; }

    public virtual DbSet<CollageFile> CollageFiles { get; set; }

    public virtual DbSet<File> Files { get; set; }

    public virtual DbSet<FileTag> FileTags { get; set; }

    public virtual DbSet<PointFile> PointFiles { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<Trip> Trips { get; set; }

    public virtual DbSet<TripPoint> TripPoints { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Database=travel_memories;Username=postgres;Password=12345A");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AiImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ai_images_pkey");

            entity.ToTable("ai_images");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.FileId).HasColumnName("file_id");
            entity.Property(e => e.Prompt).HasColumnName("prompt");
            entity.Property(e => e.Style)
                .HasMaxLength(50)
                .HasColumnName("style");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.File).WithMany(p => p.AiImages)
                .HasForeignKey(d => d.FileId)
                .HasConstraintName("ai_images_file_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.AiImages)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ai_images_user_id_fkey");
        });

        modelBuilder.Entity<Collage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("collages_pkey");

            entity.ToTable("collages");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CanvasData)
                .HasColumnType("jsonb")
                .HasColumnName("canvas_data");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.ThumbnailUrl)
                .HasMaxLength(255)
                .HasColumnName("thumbnail_url");
            entity.Property(e => e.TripId).HasColumnName("trip_id");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

            entity.HasOne(d => d.Trip).WithMany(p => p.Collages)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("collages_trip_id_fkey");
        });

        modelBuilder.Entity<CollageFile>(entity =>
        {
            entity.HasKey(e => new { e.CollageId, e.FileId }).HasName("collage_files_pkey");

            entity.ToTable("collage_files");

            entity.Property(e => e.CollageId).HasColumnName("collage_id");
            entity.Property(e => e.FileId).HasColumnName("file_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");

            entity.HasOne(d => d.Collage).WithMany(p => p.CollageFiles)
                .HasForeignKey(d => d.CollageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("collage_files_collage_id_fkey");

            entity.HasOne(d => d.File).WithMany(p => p.CollageFiles)
                .HasForeignKey(d => d.FileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("collage_files_file_id_fkey");
        });

        modelBuilder.Entity<File>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("files_pkey");

            entity.ToTable("files");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.FileName)
                .HasMaxLength(255)
                .HasColumnName("file_name");
            entity.Property(e => e.FilePath)
                .HasMaxLength(255)
                .HasColumnName("file_path");
            entity.Property(e => e.FileSize).HasColumnName("file_size");
            entity.Property(e => e.FileType)
                .HasMaxLength(50)
                .HasColumnName("file_type");
            entity.Property(e => e.Latitude)
                .HasPrecision(10, 8)
                .HasColumnName("latitude");
            entity.Property(e => e.Longitude)
                .HasPrecision(11, 8)
                .HasColumnName("longitude");
            entity.Property(e => e.MimeType)
                .HasMaxLength(100)
                .HasColumnName("mime_type");
            entity.Property(e => e.TakenAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("taken_at");
            entity.Property(e => e.TripId).HasColumnName("trip_id");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

            entity.HasOne(d => d.Trip).WithMany(p => p.Files)
                .HasForeignKey(d => d.TripId)
                .HasConstraintName("files_trip_id_fkey");
        });

        modelBuilder.Entity<FileTag>(entity =>
        {
            entity.HasKey(e => new { e.FileId, e.TagId }).HasName("file_tags_pkey");

            entity.ToTable("file_tags");

            entity.Property(e => e.FileId).HasColumnName("file_id");
            entity.Property(e => e.TagId).HasColumnName("tag_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");

            entity.HasOne(d => d.File).WithMany(p => p.FileTags)
                .HasForeignKey(d => d.FileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("file_tags_file_id_fkey");

            entity.HasOne(d => d.Tag).WithMany(p => p.FileTags)
                .HasForeignKey(d => d.TagId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("file_tags_tag_id_fkey");
        });

        modelBuilder.Entity<PointFile>(entity =>
        {
            entity.HasKey(e => new { e.PointId, e.FileId }).HasName("point_files_pkey");

            entity.ToTable("point_files");

            entity.Property(e => e.PointId).HasColumnName("point_id");
            entity.Property(e => e.FileId).HasColumnName("file_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");

            entity.HasOne(d => d.File).WithMany(p => p.PointFiles)
                .HasForeignKey(d => d.FileId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("point_files_file_id_fkey");

            entity.HasOne(d => d.Point).WithMany(p => p.PointFiles)
                .HasForeignKey(d => d.PointId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("point_files_point_id_fkey");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("tags_pkey");

            entity.ToTable("tags");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Trip>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("trips_pkey");

            entity.ToTable("trips");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.LocationName)
                .HasMaxLength(100)
                .HasColumnName("location_name");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Trips)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("trips_user_id_fkey");
        });

        modelBuilder.Entity<TripPoint>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("trip_points_pkey");

            entity.ToTable("trip_points");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Latitude)
                .HasPrecision(10, 8)
                .HasColumnName("latitude");
            entity.Property(e => e.Longitude)
                .HasPrecision(11, 8)
                .HasColumnName("longitude");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.OrderIndex).HasColumnName("order_index");
            entity.Property(e => e.TripId).HasColumnName("trip_id");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");

            entity.HasOne(d => d.Trip).WithMany(p => p.TripPoints)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("trip_points_trip_id_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.AiQuota)
                .HasDefaultValue(50)
                .HasColumnName("ai_quota");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("last_name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasDefaultValueSql("'USER'::character varying")
                .HasColumnName("role");
            entity.Property(e => e.StorageQuota)
                .HasDefaultValue(10240)
                .HasColumnName("storage_quota");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updated_at");
            entity.Property(e => e.UpdatedBy).HasColumnName("updated_by");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
