namespace Agromarket.Application.DTOs;

public class ProfileResponse
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Email { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? CompanyName { get; set; }

    public string? Address { get; set; }

    public bool IsVerified { get; set; }

    public string Role { get; set; } = string.Empty;
}