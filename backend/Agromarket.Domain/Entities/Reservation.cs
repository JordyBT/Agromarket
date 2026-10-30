namespace Agromarket.Domain.Entities;

public enum ReservationStatus
{
    Pending,
    Accepted,
    Rejected,
    Cancelled
}

public class Reservation
{
    public Guid Id { get; set; }

    public Guid PublicationId { get; set; }

    public Guid BuyerId { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public ReservationStatus Status { get; set; }
        = ReservationStatus.Pending;

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }

    public Publication Publication { get; set; } = null!;

    public User Buyer { get; set; } = null!;

    public Review? Review { get; set; }
}