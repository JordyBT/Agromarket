using System.ComponentModel.DataAnnotations;

namespace Agromarket.Application.DTOs;

public sealed class CreatePublicationRequest
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "9999999999.99")]
    public decimal Price { get; set; }

    [Range(1, int.MaxValue)]
    public int Stock { get; set; }

    [Required]
    [MaxLength(30)]
    public string Unit { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string Category { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int MinimumOrder { get; set; }

    [Required]
    [MaxLength(100)]
    public string Department { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Municipality { get; set; } = string.Empty;
}