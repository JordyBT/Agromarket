using System.ComponentModel.DataAnnotations;

namespace Agromarket.Application.DTOs;

public class CreateReservationRequest
{
    [Required]
    public Guid PublicationId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}