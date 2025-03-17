using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class CollageFile
{
    public Guid CollageId { get; set; }

    public Guid FileId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Collage Collage { get; set; } = null!;

    public virtual File File { get; set; } = null!;
}
