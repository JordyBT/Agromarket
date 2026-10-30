namespace Agromarket.Domain.Entities;

public class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public Guid RoleId { get; set; }

    public Role Role { get; set; } = null!;

    public UserProfile? Profile { get; set; }

    public ICollection<Publication> Publications { get; set; }
        = new List<Publication>();

    public ICollection<Reservation> ReservationsAsBuyer { get; set; }
        = new List<Reservation>();

    public ICollection<Favorite> Favorites { get; set; }
        = new List<Favorite>();

    public ICollection<Review> ReviewsAsBuyer { get; set; }
        = new List<Review>();

    public ICollection<Review> ReviewsAsProvider { get; set; }
        = new List<Review>();
}