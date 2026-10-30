namespace Agromarket.Domain.Entities;

public class Favorite
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid PublicationId { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public Publication Publication { get; set; } = null!;
}