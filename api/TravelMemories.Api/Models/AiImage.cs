using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class AiImage
{
    public Guid Id { get; set; }

    public string Prompt { get; set; } = null!;

    public string? Style { get; set; }

    public Guid? FileId { get; set; }

    public Guid UserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public virtual File? File { get; set; }

    public virtual User User { get; set; } = null!;
}
