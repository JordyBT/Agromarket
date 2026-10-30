using System.Security.Claims;
using Agromarket.Api.Services;
using Agromarket.Application.DTOs;
using Agromarket.Domain.Entities;
using Agromarket.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agromarket.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly SupabaseStorageService _storage;

    private const long MaxImageSize =
        5 * 1024 * 1024;

    private static readonly string[] AllowedImageExtensions =
    [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    private static readonly string[] AllowedImageContentTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    public PublicationsController(
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _context = context;

        _storage =
            new SupabaseStorageService(
                configuration
            );
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var publications =
            await _context.Publications
                .AsNoTracking()
                .Where(x =>
                    x.IsActive &&
                    x.Stock > 0)
                .OrderByDescending(x =>
                    x.CreatedAt)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Description,
                    x.Price,
                    x.Stock,
                    x.Unit,
                    x.Category,
                    x.MinimumOrder,
                    x.Department,
                    x.Municipality,
                    x.ImageUrl,
                    x.IsActive,
                    x.CreatedAt,

                    Seller = new
                    {
                        x.User.Id,
                        x.User.Email
                    }
                })
                .ToListAsync();

        return Ok(publications);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(
        Guid id)
    {
        var publication =
            await _context.Publications
                .AsNoTracking()
                .Where(x =>
                    x.Id == id &&
                    x.IsActive &&
                    x.Stock > 0)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Description,
                    x.Price,
                    x.Stock,
                    x.Unit,
                    x.Category,
                    x.MinimumOrder,
                    x.Department,
                    x.Municipality,
                    x.ImageUrl,
                    x.IsActive,
                    x.CreatedAt,

                    Seller = new
                    {
                        x.User.Id,
                        x.User.Email
                    }
                })
                .FirstOrDefaultAsync();

        if (publication is null)
        {
            return NotFound(new
            {
                message =
                    "Publicación no encontrada o no disponible."
            });
        }

        return Ok(publication);
    }

    [HttpGet("mine")]
    [Authorize(Roles = "Proveedor,Administrador")]
    public async Task<IActionResult> GetMine()
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var publications =
            await _context.Publications
                .AsNoTracking()
                .Where(x =>
                    x.UserId ==
                    userId.Value)
                .OrderByDescending(x =>
                    x.CreatedAt)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Description,
                    x.Price,
                    x.Stock,
                    x.Unit,
                    x.Category,
                    x.MinimumOrder,
                    x.Department,
                    x.Municipality,
                    x.ImageUrl,
                    x.IsActive,
                    x.CreatedAt,

                    Seller = new
                    {
                        x.User.Id,
                        x.User.Email
                    }
                })
                .ToListAsync();

        return Ok(publications);
    }

    [HttpGet("mine/{id:guid}")]
    [Authorize(Roles = "Proveedor,Administrador")]
    public async Task<IActionResult> GetMineById(
        Guid id)
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var publication =
            await _context.Publications
                .AsNoTracking()
                .Where(x =>
                    x.Id == id &&
                    x.UserId ==
                    userId.Value)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Description,
                    x.Price,
                    x.Stock,
                    x.Unit,
                    x.Category,
                    x.MinimumOrder,
                    x.Department,
                    x.Municipality,
                    x.ImageUrl,
                    x.IsActive,
                    x.CreatedAt,

                    Seller = new
                    {
                        x.User.Id,
                        x.User.Email
                    }
                })
                .FirstOrDefaultAsync();

        if (publication is null)
        {
            return NotFound(new
            {
                message =
                    "Publicación no encontrada."
            });
        }

        return Ok(publication);
    }

    [HttpPost]
    [Authorize(Roles = "Proveedor,Administrador")]
    public async Task<IActionResult> Create(
        CreatePublicationRequest request)
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        if (request.Price <= 0)
        {
            return BadRequest(new
            {
                message =
                    "El precio debe ser mayor que cero."
            });
        }

        if (request.Stock < 0)
        {
            return BadRequest(new
            {
                message =
                    "El inventario no puede ser negativo."
            });
        }

        if (request.MinimumOrder <= 0)
        {
            return BadRequest(new
            {
                message =
                    "La compra mínima debe ser mayor que cero."
            });
        }

        if (
            request.Stock > 0 &&
            request.MinimumOrder >
            request.Stock)
        {
            return BadRequest(new
            {
                message =
                    "La compra mínima no puede superar el inventario disponible."
            });
        }

        var user =
            await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.Id ==
                    userId.Value &&
                    x.IsActive);

        if (user is null)
        {
            return NotFound(new
            {
                message =
                    "Usuario no encontrado."
            });
        }

        var publication =
            new Publication
            {
                Id = Guid.NewGuid(),
                UserId =
                    userId.Value,
                Title =
                    request.Title.Trim(),
                Description =
                    request.Description.Trim(),
                Price =
                    request.Price,
                Stock =
                    request.Stock,
                Unit =
                    request.Unit.Trim(),
                Category =
                    request.Category.Trim(),
                MinimumOrder =
                    request.MinimumOrder,
                Department =
                    request.Department.Trim(),
                Municipality =
                    request.Municipality.Trim(),
                ImageUrl = null,
                IsActive =
                    request.Stock > 0,
                CreatedAt =
                    DateTime.UtcNow
            };

        _context.Publications.Add(
            publication
        );

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id =
                    publication.Id
            },
            ToResponse(
                publication,
                user.Email
            )
        );
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Proveedor,Administrador")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdatePublicationRequest request)
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var publication =
            await _context.Publications
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.UserId ==
                    userId.Value);

        if (publication is null)
        {
            return NotFound(new
            {
                message =
                    "Publicación no encontrada."
            });
        }

        if (request.Price <= 0)
        {
            return BadRequest(new
            {
                message =
                    "El precio debe ser mayor que cero."
            });
        }

        if (request.Stock < 0)
        {
            return BadRequest(new
            {
                message =
                    "El inventario no puede ser negativo."
            });
        }

        if (request.MinimumOrder <= 0)
        {
            return BadRequest(new
            {
                message =
                    "La compra mínima debe ser mayor que cero."
            });
        }

        if (
            request.Stock > 0 &&
            request.MinimumOrder >
            request.Stock)
        {
            return BadRequest(new
            {
                message =
                    "La compra mínima no puede superar el inventario disponible."
            });
        }

        publication.Title =
            request.Title.Trim();

        publication.Description =
            request.Description.Trim();

        publication.Price =
            request.Price;

        publication.Stock =
            request.Stock;

        publication.Unit =
            request.Unit.Trim();

        publication.Category =
            request.Category.Trim();

        publication.MinimumOrder =
            request.MinimumOrder;

        publication.Department =
            request.Department.Trim();

        publication.Municipality =
            request.Municipality.Trim();

        if (publication.Stock == 0)
        {
            publication.IsActive =
                false;
        }

        await _context.SaveChangesAsync();

        var email =
            await _context.Users
                .Where(x =>
                    x.Id ==
                    publication.UserId)
                .Select(x =>
                    x.Email)
                .FirstOrDefaultAsync();

        return Ok(
            ToResponse(
                publication,
                email
            )
        );
    }

    [HttpPatch("{id:guid}/status/{isActive:bool}")]
    [Authorize(Roles = "Proveedor,Administrador")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        bool isActive)
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var publication =
            await _context.Publications
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.UserId ==
                    userId.Value);

        if (publication is null)
        {
            return NotFound(new
            {
                message =
                    "Publicación no encontrada."
            });
        }

        if (
            isActive &&
            publication.Stock <= 0)
        {
            return BadRequest(new
            {
                message =
                    "No puedes activar una publicación sin inventario."
            });
        }

        publication.IsActive =
            isActive;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            publication.Id,
            publication.IsActive,
            publication.Stock
        });
    }

    [HttpPost("{id:guid}/image")]
    [Authorize(Roles = "Proveedor,Administrador")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImage(
        Guid id,
        IFormFile image)
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var publication =
            await _context.Publications
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.UserId ==
                    userId.Value);

        if (publication is null)
        {
            return NotFound(new
            {
                message =
                    "Publicación no encontrada."
            });
        }

        if (
            image is null ||
            image.Length == 0)
        {
            return BadRequest(new
            {
                message =
                    "Debes seleccionar una imagen."
            });
        }

        if (
            image.Length >
            MaxImageSize)
        {
            return BadRequest(new
            {
                message =
                    "La imagen no puede superar los 5 MB."
            });
        }

        var extension =
            Path.GetExtension(
                image.FileName
            )
            .ToLowerInvariant();

        if (
            string.IsNullOrWhiteSpace(
                extension) ||
            !AllowedImageExtensions.Contains(
                extension))
        {
            return BadRequest(new
            {
                message =
                    "Solo se permiten imágenes JPG, JPEG, PNG o WEBP."
            });
        }

        var contentType =
            image.ContentType
                .ToLowerInvariant();

        if (
            !AllowedImageContentTypes.Contains(
                contentType))
        {
            return BadRequest(new
            {
                message =
                    "El tipo de archivo seleccionado no es válido."
            });
        }

        var objectPath =
            $"publications/{publication.Id}/{Guid.NewGuid():N}{extension}";

        var previousImageUrl =
            publication.ImageUrl;

        string newImageUrl;

        try
        {
            newImageUrl =
                await _storage.UploadAsync(
                    image,
                    objectPath,
                    HttpContext.RequestAborted
                );
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"ERROR SUPABASE STORAGE: {ex.Message}"
            );

            return StatusCode(
                StatusCodes.Status502BadGateway,
                new
                {
                    message =
                        "No fue posible subir la imagen a Supabase Storage."
                }
            );
        }

        publication.ImageUrl =
            newImageUrl;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch
        {
            try
            {
                await _storage.DeleteByPublicUrlAsync(
                    newImageUrl,
                    HttpContext.RequestAborted
                );
            }
            catch
            {
            }

            throw;
        }

        if (
            !string.IsNullOrWhiteSpace(
                previousImageUrl))
        {
            try
            {
                await _storage.DeleteByPublicUrlAsync(
                    previousImageUrl,
                    HttpContext.RequestAborted
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"ERROR ELIMINANDO IMAGEN ANTERIOR: {ex.Message}"
                );
            }
        }

        return Ok(new
        {
            publication.Id,
            publication.ImageUrl
        });
    }

    [HttpDelete("{id:guid}/image")]
    [Authorize(Roles = "Proveedor,Administrador")]
    public async Task<IActionResult> DeleteImage(
        Guid id)
    {
        var userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var publication =
            await _context.Publications
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.UserId ==
                    userId.Value);

        if (publication is null)
        {
            return NotFound(new
            {
                message =
                    "Publicación no encontrada."
            });
        }

        if (
            !string.IsNullOrWhiteSpace(
                publication.ImageUrl))
        {
            try
            {
                await _storage.DeleteByPublicUrlAsync(
                    publication.ImageUrl,
                    HttpContext.RequestAborted
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"ERROR ELIMINANDO IMAGEN: {ex.Message}"
                );

                return StatusCode(
                    StatusCodes.Status502BadGateway,
                    new
                    {
                        message =
                            "No fue posible eliminar la imagen de Supabase Storage."
                    }
                );
            }
        }

        publication.ImageUrl =
            null;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Guid? GetCurrentUserId()
    {
        var value =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (
            !Guid.TryParse(
                value,
                out var userId))
        {
            return null;
        }

        return userId;
    }

    private static object ToResponse(
        Publication publication,
        string? sellerEmail)
    {
        return new
        {
            publication.Id,
            publication.Title,
            publication.Description,
            publication.Price,
            publication.Stock,
            publication.Unit,
            publication.Category,
            publication.MinimumOrder,
            publication.Department,
            publication.Municipality,
            publication.ImageUrl,
            publication.IsActive,
            publication.CreatedAt,

            Seller = new
            {
                Id =
                    publication.UserId,

                Email =
                    sellerEmail ??
                    string.Empty
            }
        };
    }
}