namespace Agromarket.Domain.Entities;

public class Conversation
{
    public Guid Id { get; set; }

    public Guid PublicationId { get; set; }

    public Guid BuyerId { get; set; }

    public Guid ProviderId { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; }
        = DateTime.UtcNow;

    public Publication Publication { get; set; } = null!;

    public User Buyer { get; set; } = null!;

    public User Provider { get; set; } = null!;

    public ICollection<ChatMessage> Messages { get; set; }
        = new List<ChatMessage>();
}