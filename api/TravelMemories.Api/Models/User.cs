using System;
using System.Collections.Generic;

namespace TravelMemories.Api.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Role { get; set; } = null!;

    public int? StorageQuota { get; set; }

    public int? AiQuota { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public virtual ICollection<AiImage> AiImages { get; set; } = new List<AiImage>();

    public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();
}
