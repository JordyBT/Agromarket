using System.Security.Claims;
using Agromarket.Domain.Entities;
using Agromarket.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agromarket.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Administrador")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // RESUMEN GENERAL
    // =========================================================

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalUsers =
            await _context.Users.CountAsync();

        var activeUsers =
            await _context.Users.CountAsync(
                x => x.IsActive
            );

        var totalBuyers =
            await _context.Users.CountAsync(
                x => x.Role.Name == "Comprador"
            );

        var totalProviders =
            await _context.Users.CountAsync(
                x => x.Role.Name == "Proveedor"
            );

        var totalAdmins =
            await _context.Users.CountAsync(
                x => x.Role.Name == "Administrador"
            );

        var totalPublications =
            await _context.Publications.CountAsync();

        var activePublications =
            await _context.Publications.CountAsync(
                x =>
                    x.IsActive &&
                    x.Stock > 0
            );

        var outOfStockPublications =
            await _context.Publications.CountAsync(
                x => x.Stock <= 0
            );

        var totalReservations =
            await _context.Reservations.CountAsync();

        var pendingReservations =
            await _context.Reservations.CountAsync(
                x =>
                    x.Status ==
                    ReservationStatus.Pending
            );

        var acceptedReservations =
            await _context.Reservations.CountAsync(
                x =>
                    x.Status ==
                    ReservationStatus.Accepted
            );

        var rejectedReservations =
            await _context.Reservations.CountAsync(
                x =>
                    x.Status ==
                    ReservationStatus.Rejected
            );

        var cancelledReservations =
            await _context.Reservations.CountAsync(
                x =>
                    x.Status ==
                    ReservationStatus.Cancelled
            );

        var totalReviews =
            await _context.Reviews.CountAsync();

        var totalConversations =
            await _context.Conversations.CountAsync();

        var totalMessages =
            await _context.ChatMessages.CountAsync();

        var acceptedData =
            await _context.Reservations
                .AsNoTracking()
                .Where(x =>
                    x.Status ==
                    ReservationStatus.Accepted
                )
                .Select(x => new
                {
                    x.Quantity,
                    x.UnitPrice
                })
                .ToListAsync();

        var totalAcceptedValue =
            acceptedData.Sum(
                x =>
                    x.Quantity *
                    x.UnitPrice
            );

        return Ok(new
        {
            Users = new
            {
                Total = totalUsers,
                Active = activeUsers,
                Inactive =
                    totalUsers -
                    activeUsers,
                Buyers =
                    totalBuyers,
                Providers =
                    totalProviders,
                Admins =
                    totalAdmins
            },

            Publications = new
            {
                Total =
                    totalPublications,

                Active =
                    activePublications,

                Inactive =
                    totalPublications -
                    activePublications,

                OutOfStock =
                    outOfStockPublications
            },

            Reservations = new
            {
                Total =
                    totalReservations,

                Pending =
                    pendingReservations,

                Accepted =
                    acceptedReservations,

                Rejected =
                    rejectedReservations,

                Cancelled =
                    cancelledReservations,

                AcceptedValue =
                    totalAcceptedValue
            },

            Reviews = new
            {
                Total =
                    totalReviews
            },

            Chat = new
            {
                Conversations =
                    totalConversations,

                Messages =
                    totalMessages
            }
        });
    }

    // =========================================================
    // USUARIOS
    // =========================================================

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users =
            await _context.Users
                .AsNoTracking()
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Select(x => new
                {
                    x.Id,
                    x.Email,
                    x.IsActive,
                    x.CreatedAt,

                    Role =
                        x.Role.Name,

                    Profile =
                        x.Profile == null
                            ? null
                            : new
                            {
                                x.Profile.FirstName,
                                x.Profile.LastName,
                                x.Profile.Phone,
                                x.Profile.CompanyName,
                                x.Profile.Address
                            },

                    PublicationsCount =
                        x.Publications.Count,

                    ReservationsCount =
                        x.ReservationsAsBuyer.Count,

                    ReviewsCount =
                        x.ReviewsAsBuyer.Count
                })
                .ToListAsync();

        return Ok(users);
    }

    [HttpPatch(
        "users/{id:guid}/status/{isActive:bool}"
    )]
    public async Task<IActionResult> UpdateUserStatus(
        Guid id,
        bool isActive)
    {
        var currentAdminId =
            GetCurrentUserId();

        if (currentAdminId is null)
        {
            return Unauthorized();
        }

        if (
            currentAdminId.Value == id &&
            !isActive
        )
        {
            return BadRequest(new
            {
                message =
                    "No puedes desactivar tu propia cuenta de administrador."
            });
        }

        var user =
            await _context.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(
                    x => x.Id == id
                );

        if (user is null)
        {
            return NotFound(new
            {
                message =
                    "Usuario no encontrado."
            });
        }

        if (
            user.Role.Name ==
                "Administrador" &&
            user.Id !=
                currentAdminId.Value
        )
        {
            return BadRequest(new
            {
                message =
                    "No puedes modificar otro administrador desde este panel."
            });
        }

        user.IsActive =
            isActive;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.Email,
            user.IsActive
        });
    }

    // =========================================================
    // PUBLICACIONES
    // =========================================================

    [HttpGet("publications")]
    public async Task<IActionResult> GetPublications()
    {
        var publications =
            await _context.Publications
                .AsNoTracking()
                .OrderByDescending(
                    x => x.CreatedAt
                )
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
                        x.User.Email,

                        FirstName =
                            x.User.Profile != null
                                ? x.User.Profile.FirstName
                                : "",

                        LastName =
                            x.User.Profile != null
                                ? x.User.Profile.LastName
                                : "",

                        CompanyName =
                            x.User.Profile != null
                                ? x.User.Profile.CompanyName
                                : ""
                    },

                    ReservationsCount =
                        x.Reservations.Count,

                    FavoritesCount =
                        x.Favorites.Count
                })
                .ToListAsync();

        return Ok(publications);
    }

    [HttpPatch(
        "publications/{id:guid}/status/{isActive:bool}"
    )]
    public async Task<IActionResult>
        UpdatePublicationStatus(
            Guid id,
            bool isActive)
    {
        var publication =
            await _context.Publications
                .FirstOrDefaultAsync(
                    x => x.Id == id
                );

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
            publication.Stock <= 0
        )
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
            publication.Title,
            publication.Stock,
            publication.IsActive
        });
    }

    // =========================================================
    // RESERVAS
    // =========================================================

    [HttpGet("reservations")]
    public async Task<IActionResult> GetReservations()
    {
        var reservations =
            await _context.Reservations
                .AsNoTracking()
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Select(x => new
                {
                    x.Id,
                    x.Quantity,
                    x.UnitPrice,
                    x.Status,
                    x.CreatedAt,
                    x.ResolvedAt,

                    TotalPrice =
                        x.Quantity *
                        x.UnitPrice,

                    Publication = new
                    {
                        x.Publication.Id,
                        x.Publication.Title,
                        x.Publication.Unit,
                        x.Publication.ImageUrl
                    },

                    Buyer = new
                    {
                        x.Buyer.Id,
                        x.Buyer.Email,

                        FirstName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.FirstName
                                : "",

                        LastName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.LastName
                                : ""
                    },

                    Provider = new
                    {
                        x.Publication.User.Id,
                        x.Publication.User.Email,

                        FirstName =
                            x.Publication.User.Profile != null
                                ? x.Publication.User.Profile.FirstName
                                : "",

                        LastName =
                            x.Publication.User.Profile != null
                                ? x.Publication.User.Profile.LastName
                                : "",

                        CompanyName =
                            x.Publication.User.Profile != null
                                ? x.Publication.User.Profile.CompanyName
                                : ""
                    }
                })
                .ToListAsync();

        return Ok(reservations);
    }

    // =========================================================
    // RESEÑAS
    // =========================================================

    [HttpGet("reviews")]
    public async Task<IActionResult> GetReviews()
    {
        var reviews =
            await _context.Reviews
                .AsNoTracking()
                .OrderByDescending(
                    x => x.CreatedAt
                )
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

                    Buyer = new
                    {
                        x.Buyer.Id,
                        x.Buyer.Email,

                        FirstName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.FirstName
                                : "",

                        LastName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.LastName
                                : ""
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

    // =========================================================
    // CONVERSACIONES
    // =========================================================

    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var conversations =
            await _context.Conversations
                .AsNoTracking()
                .OrderByDescending(
                    x => x.UpdatedAt
                )
                .Select(x => new
                {
                    x.Id,
                    x.CreatedAt,
                    x.UpdatedAt,

                    Publication = new
                    {
                        x.Publication.Id,
                        x.Publication.Title,
                        x.Publication.ImageUrl
                    },

                    Buyer = new
                    {
                        x.Buyer.Id,
                        x.Buyer.Email,

                        FirstName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.FirstName
                                : "",

                        LastName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.LastName
                                : ""
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
                    },

                    MessagesCount =
                        x.Messages.Count,

                    LastMessage =
                        x.Messages
                            .OrderByDescending(
                                message =>
                                    message.CreatedAt
                            )
                            .Select(
                                message =>
                                    new
                                    {
                                        message.Id,
                                        message.SenderId,
                                        message.Content,
                                        message.CreatedAt
                                    }
                            )
                            .FirstOrDefault()
                })
                .ToListAsync();

        return Ok(conversations);
    }

    [HttpGet(
        "conversations/{id:guid}/messages"
    )]
    public async Task<IActionResult>
        GetConversationMessages(
            Guid id)
    {
        var conversation =
            await _context.Conversations
                .AsNoTracking()
                .Where(
                    x =>
                        x.Id == id
                )
                .Select(x => new
                {
                    x.Id,
                    x.CreatedAt,
                    x.UpdatedAt,

                    Publication = new
                    {
                        x.Publication.Id,
                        x.Publication.Title,
                        x.Publication.ImageUrl
                    },

                    Buyer = new
                    {
                        x.Buyer.Id,
                        x.Buyer.Email,

                        FirstName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.FirstName
                                : "",

                        LastName =
                            x.Buyer.Profile != null
                                ? x.Buyer.Profile.LastName
                                : ""
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
                .FirstOrDefaultAsync();

        if (conversation is null)
        {
            return NotFound(new
            {
                message =
                    "Conversación no encontrada."
            });
        }

        var messages =
            await _context.ChatMessages
                .AsNoTracking()
                .Where(
                    x =>
                        x.ConversationId == id
                )
                .OrderBy(
                    x =>
                        x.CreatedAt
                )
                .Select(x => new
                {
                    x.Id,
                    x.ConversationId,
                    x.SenderId,
                    x.Content,
                    x.CreatedAt,

                    Sender = new
                    {
                        x.Sender.Id,
                        x.Sender.Email,

                        FirstName =
                            x.Sender.Profile != null
                                ? x.Sender.Profile.FirstName
                                : "",

                        LastName =
                            x.Sender.Profile != null
                                ? x.Sender.Profile.LastName
                                : ""
                    }
                })
                .ToListAsync();

        return Ok(new
        {
            Conversation =
                conversation,

            Messages =
                messages
        });
    }

    // =========================================================
    // ACTIVIDAD RECIENTE
    // =========================================================

    [HttpGet("activity")]
    public async Task<IActionResult> GetActivity()
    {
        var recentPublications =
            await _context.Publications
                .AsNoTracking()
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Take(5)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.CreatedAt,

                    SellerEmail =
                        x.User.Email
                })
                .ToListAsync();

        var recentReservations =
            await _context.Reservations
                .AsNoTracking()
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Take(5)
                .Select(x => new
                {
                    x.Id,
                    x.Status,
                    x.Quantity,
                    x.CreatedAt,

                    PublicationTitle =
                        x.Publication.Title,

                    BuyerEmail =
                        x.Buyer.Email
                })
                .ToListAsync();

        var recentReviews =
            await _context.Reviews
                .AsNoTracking()
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Take(5)
                .Select(x => new
                {
                    x.Id,
                    x.Rating,
                    x.Comment,
                    x.CreatedAt,

                    BuyerEmail =
                        x.Buyer.Email,

                    ProviderEmail =
                        x.Provider.Email,

                    PublicationTitle =
                        x.Reservation
                            .Publication
                            .Title
                })
                .ToListAsync();

        return Ok(new
        {
            RecentPublications =
                recentPublications,

            RecentReservations =
                recentReservations,

            RecentReviews =
                recentReviews
        });
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
                out var userId
            )
        )
        {
            return null;
        }

        return userId;
    }
}