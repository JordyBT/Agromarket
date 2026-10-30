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
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewsController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Comprador")]
    public async Task<IActionResult> Create(
        CreateReviewRequest request)
    {
        var buyerIdValue =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (!Guid.TryParse(
                buyerIdValue,
                out var buyerId))
        {
            return Unauthorized();
        }

        if (request.Rating < 1 ||
            request.Rating > 5)
        {
            return BadRequest(new
            {
                message =
                    "La calificación debe estar entre 1 y 5 estrellas."
            });
        }

        var reservation =
            await _context.Reservations
                .Include(x => x.Publication)
                .FirstOrDefaultAsync(x =>
                    x.Id == request.ReservationId &&
                    x.BuyerId == buyerId
                );

        if (reservation is null)
        {
            return NotFound(new
            {
                message =
                    "Reserva no encontrada."
            });
        }

        if (reservation.Status !=
            ReservationStatus.Accepted)
        {
            return BadRequest(new
            {
                message =
                    "Solo puedes reseñar una compra cuya reserva haya sido aceptada."
            });
        }

        var alreadyReviewed =
            await _context.Reviews
                .AnyAsync(x =>
                    x.ReservationId ==
                    reservation.Id
                );

        if (alreadyReviewed)
        {
            return Conflict(new
            {
                message =
                    "Ya publicaste una reseña para esta reserva."
            });
        }

        var providerId =
            reservation.Publication.UserId;

        if (providerId == buyerId)
        {
            return BadRequest(new
            {
                message =
                    "No puedes reseñarte a ti mismo."
            });
        }

        string? comment = null;

        if (!string.IsNullOrWhiteSpace(
                request.Comment))
        {
            comment =
                request.Comment.Trim();
        }

        var review =
            new Review
            {
                Id = Guid.NewGuid(),
                ReservationId =
                    reservation.Id,
                BuyerId =
                    buyerId,
                ProviderId =
                    providerId,
                Rating =
                    request.Rating,
                Comment =
                    comment,
                CreatedAt =
                    DateTime.UtcNow
            };

        _context.Reviews.Add(review);

        await _context.SaveChangesAsync();

        return Created("", new
        {
            review.Id,
            review.ReservationId,
            review.BuyerId,
            review.ProviderId,
            review.Rating,
            review.Comment,
            review.CreatedAt
        });
    }

    [HttpGet("mine")]
    [Authorize(Roles = "Comprador")]
    public async Task<IActionResult> GetMine()
    {
        var buyerIdValue =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (!Guid.TryParse(
                buyerIdValue,
                out var buyerId))
        {
            return Unauthorized();
        }

        var reviews =
            await _context.Reviews
                .AsNoTracking()
                .Where(x =>
                    x.BuyerId == buyerId)
                .OrderByDescending(x =>
                    x.CreatedAt)
                .Select(x => new
                {
                    x.Id,
                    x.ReservationId,
                    x.Rating,
                    x.Comment,
                    x.CreatedAt,

                    Publication = new
                    {
                        x.Reservation.Publication.Id,
                        x.Reservation.Publication.Title,
                        x.Reservation.Publication.ImageUrl
                    },

                    Provider = new
                    {
                        x.Provider.Id,
                        x.Provider.Email,

                        FirstName =
                            x.Provider.Profile != null
                                ? x.Provider.Profile.FirstName
                                : "",

                        LastName =
                            x.Provider.Profile != null
                                ? x.Provider.Profile.LastName
                                : "",

                        CompanyName =
                            x.Provider.Profile != null
                                ? x.Provider.Profile.CompanyName
                                : ""
                    }
                })
                .ToListAsync();

        return Ok(reviews);
    }

    [HttpGet("provider/{providerId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviderReviews(
        Guid providerId)
    {
        var providerExists =
            await _context.Users
                .AsNoTracking()
                .AnyAsync(x =>
                    x.Id == providerId &&
                    x.IsActive
                );

        if (!providerExists)
        {
            return NotFound(new
            {
                message =
                    "Proveedor no encontrado."
            });
        }

        var reviews =
            await _context.Reviews
                .AsNoTracking()
                .Where(x =>
                    x.ProviderId == providerId)
                .OrderByDescending(x =>
                    x.CreatedAt)
                .Select(x => new
                {
                    x.Id,
                    x.Rating,
                    x.Comment,
                    x.CreatedAt,

                    Buyer = new
                    {
                        x.Buyer.Id,

                        FirstName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.FirstName
                                : "",

                        LastName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.LastName
                                : ""
                    },

                    Publication = new
                    {
                        x.Reservation.Publication.Id,
                        x.Reservation.Publication.Title
                    }
                })
                .ToListAsync();

        var totalReviews =
            reviews.Count;

        var averageRating =
            totalReviews == 0
                ? 0
                : Math.Round(
                    reviews.Average(x =>
                        x.Rating),
                    1
                );

        return Ok(new
        {
            ProviderId = providerId,
            AverageRating = averageRating,
            TotalReviews = totalReviews,
            Reviews = reviews
        });
    }

    [HttpGet("reservation/{reservationId:guid}")]
    [Authorize(Roles = "Comprador")]
    public async Task<IActionResult> GetByReservation(
        Guid reservationId)
    {
        var buyerIdValue =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (!Guid.TryParse(
                buyerIdValue,
                out var buyerId))
        {
            return Unauthorized();
        }

        var reservation =
            await _context.Reservations
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.Id == reservationId &&
                    x.BuyerId == buyerId
                );

        if (reservation is null)
        {
            return NotFound(new
            {
                message =
                    "Reserva no encontrada."
            });
        }

        var review =
            await _context.Reviews
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.ReservationId ==
                    reservationId &&
                    x.BuyerId ==
                    buyerId
                );

        return Ok(new
        {
            ReservationId =
                reservationId,

            CanReview =
                reservation.Status ==
                    ReservationStatus.Accepted &&
                review == null,

            HasReview =
                review != null,

            Review =
                review == null
                    ? null
                    : new
                    {
                        review.Id,
                        review.Rating,
                        review.Comment,
                        review.CreatedAt
                    }
        });
    }
}