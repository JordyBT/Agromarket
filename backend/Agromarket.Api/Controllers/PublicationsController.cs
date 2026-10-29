using System.Security.Claims;
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

    public PublicationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Proveedor,Administrador")]
    [HttpPost]
    public async Task<IActionResult> Create(CreatePublicationRequest request)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        if (request.MinimumOrder > request.Stock)
        {
            return BadRequest(new
            {
                message = "La compra mínima no puede superar el inventario disponible."
            });
        }

        var userExists = await _context.Users
            .AnyAsync(x => x.Id == userId && x.IsActive);

        if (!userExists)
        {
            return NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        var publication = new Publication
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            Stock = request.Stock,
            Unit = request.Unit.Trim(),
            Category = request.Category.Trim(),
            MinimumOrder = request.MinimumOrder,
            Department = request.Department.Trim(),
            Municipality = request.Municipality.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Publications.Add(publication);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = publication.Id },
            new
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
                publication.IsActive,
                publication.CreatedAt
            }
        );
    }

    [Authorize(Roles = "Proveedor,Administrador")]
    [HttpPost("demo")]
    public async Task<IActionResult> CreateDemoPublications()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized();
        }

        var userExists = await _context.Users
            .AnyAsync(x => x.Id == userId);

        if (!userExists)
        {
            return NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        var demoPublications = new List<Publication>
        {
            new()
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Maíz amarillo",
                Description = "Maíz amarillo seco disponible para entrega inmediata.",
                Price = 185.50m,
                Stock = 120,
                Unit = "Quintal",
                Category = "Granos y cereales",
                MinimumOrder = 10,
                Department = "Guatemala",
                Municipality = "Guatemala",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Frijol negro",
                Description = "Frijol negro seleccionado de producción nacional.",
                Price = 430.00m,
                Stock = 60,
                Unit = "Quintal",
                Category = "Granos y cereales",
                MinimumOrder = 5,
                Department = "Chiquimula",
                Municipality = "Chiquimula",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = "Café pergamino",
                Description = "Café pergamino seco disponible por lote.",
                Price = 950.00m,
                Stock = 35,
                Unit = "Quintal",
                Category = "Café",
                MinimumOrder = 5,
                Department = "Huehuetenango",
                Municipality = "Huehuetenango",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        _context.Publications.AddRange(demoPublications);
        await _context.SaveChangesAsync();

        return Created("", new
        {
            message = "Publicaciones demo creadas correctamente.",
            count = demoPublications.Count
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var publications = await _context.Publications
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderByDescending(x => x.CreatedAt)
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
    public async Task<IActionResult> GetById(Guid id)
    {
        var publication = await _context.Publications
            .AsNoTracking()
            .Where(x => x.Id == id && x.IsActive)
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
                message = "Publicación no encontrada."
            });
        }

        return Ok(publication);
    }
}