using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Api.Services;

public interface ILogService
{
    Task RegistrarAsync(TipoEvento tipo, string? query = null,
        Guid? socioId = null, Guid? usuarioId = null,
        string? ip = null, string? userAgent = null);
}
