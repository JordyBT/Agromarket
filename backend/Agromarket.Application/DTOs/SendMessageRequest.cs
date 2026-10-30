using System.ComponentModel.DataAnnotations;

namespace Agromarket.Application.DTOs;

public class SendMessageRequest
{
    [Required]
    [StringLength(
        1000,
        MinimumLength = 1
    )]
    public string Content { get; set; }
        = string.Empty;
}