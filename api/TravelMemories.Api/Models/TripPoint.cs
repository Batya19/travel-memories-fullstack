using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class TripPoint
{
    public Guid Id { get; set; }

    public Guid TripId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public int OrderIndex { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public virtual ICollection<PointFile> PointFiles { get; set; } = new List<PointFile>();

    public virtual Trip Trip { get; set; } = null!;
}
