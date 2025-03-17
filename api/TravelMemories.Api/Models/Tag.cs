using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class Tag
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public virtual ICollection<FileTag> FileTags { get; set; } = new List<FileTag>();
}
