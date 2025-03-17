using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class File
{
    public Guid Id { get; set; }

    public string FileName { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public string FileType { get; set; } = null!;

    public int FileSize { get; set; }

    public string MimeType { get; set; } = null!;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public DateTime? TakenAt { get; set; }

    public Guid? TripId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public virtual ICollection<AiImage> AiImages { get; set; } = new List<AiImage>();

    public virtual ICollection<CollageFile> CollageFiles { get; set; } = new List<CollageFile>();

    public virtual ICollection<FileTag> FileTags { get; set; } = new List<FileTag>();

    public virtual ICollection<PointFile> PointFiles { get; set; } = new List<PointFile>();

    public virtual Trip? Trip { get; set; }
}
