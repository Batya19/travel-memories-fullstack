using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class Trip
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string? LocationName { get; set; }

    public Guid UserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public virtual ICollection<Collage> Collages { get; set; } = new List<Collage>();

    public virtual ICollection<File> Files { get; set; } = new List<File>();

    public virtual ICollection<TripPoint> TripPoints { get; set; } = new List<TripPoint>();

    public virtual User User { get; set; } = null!;
}
