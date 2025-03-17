using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class FileTag
{
    public Guid FileId { get; set; }

    public Guid TagId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public virtual File File { get; set; } = null!;

    public virtual Tag Tag { get; set; } = null!;
}
