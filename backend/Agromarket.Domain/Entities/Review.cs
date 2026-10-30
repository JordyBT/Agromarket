namespace Agromarket.Domain.Entities;

public class Review
{
    public Guid Id { get; set; }

    public Guid ReservationId { get; set; }

    public Guid BuyerId { get; set; }

    public Guid ProviderId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public Reservation Reservation { get; set; } = null!;

    public User Buyer { get; set; } = null!;

    public User Provider { get; set; } = null!;
}