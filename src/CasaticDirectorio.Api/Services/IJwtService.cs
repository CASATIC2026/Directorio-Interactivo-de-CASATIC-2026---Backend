using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Api.Services;

public interface IJwtService
{
    string GenerateToken(Usuario usuario);
}
