namespace Agromarket.Domain.Entities;

public class Publication
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public string Unit { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int MinimumOrder { get; set; }

    public string Department { get; set; } = string.Empty;

    public string Municipality { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public ICollection<Reservation> Reservations { get; set; }
        = new List<Reservation>();
}