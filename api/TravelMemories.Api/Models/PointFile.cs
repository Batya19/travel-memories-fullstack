using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class PointFile
{
    public Guid PointId { get; set; }

    public Guid FileId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual File File { get; set; } = null!;

    public virtual TripPoint Point { get; set; } = null!;
}
