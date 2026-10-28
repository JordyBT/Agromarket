using Agromarket.Domain.Entities;

namespace Agromarket.Application.Interfaces;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAt) GenerateToken(User user);
}