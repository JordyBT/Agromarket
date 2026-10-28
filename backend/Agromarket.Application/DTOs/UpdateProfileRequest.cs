using System.ComponentModel.DataAnnotations;

namespace Agromarket.Application.DTOs;

public class UpdateProfileRequest
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [MaxLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es obligatorio.")]
    [MaxLength(100, ErrorMessage = "El apellido no puede superar los 100 caracteres.")]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(30, ErrorMessage = "El teléfono no puede superar los 30 caracteres.")]
    public string? Phone { get; set; }

    [MaxLength(200, ErrorMessage = "El nombre de la empresa no puede superar los 200 caracteres.")]
    public string? CompanyName { get; set; }

    [MaxLength(300, ErrorMessage = "La dirección no puede superar los 300 caracteres.")]
    public string? Address { get; set; }
}