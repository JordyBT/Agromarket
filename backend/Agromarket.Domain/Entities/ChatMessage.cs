namespace Agromarket.Domain.Entities;

public class ChatMessage
{
    public Guid Id { get; set; }

    public Guid ConversationId { get; set; }

    public Guid SenderId { get; set; }

    public string Content { get; set; }
        = string.Empty;

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public Conversation Conversation { get; set; } = null!;

    public User Sender { get; set; } = null!;
}