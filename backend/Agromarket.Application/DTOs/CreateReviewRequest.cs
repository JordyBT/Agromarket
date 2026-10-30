using System.ComponentModel.DataAnnotations;

namespace Agromarket.Application.DTOs;

public class CreateReviewRequest
{
    [Required]
    public Guid ReservationId { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }
}