using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class Collage
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string CanvasData { get; set; } = null!;

    public Guid? TripId { get; set; }

    public string? ThumbnailUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public virtual ICollection<CollageFile> CollageFiles { get; set; } = new List<CollageFile>();

    public virtual Trip? Trip { get; set; }
}
