using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;

namespace CasaticDirectorio.Api.Services;

/// <summary>
/// Servicio centralizado para registrar actividad en la BD.
/// </summary>
public class LogService : ILogService
{
    private readonly ILogActividadRepository _repo;
    private readonly ILogger<LogService> _logger;

    public LogService(ILogActividadRepository repo, ILogger<LogService> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    public async Task RegistrarAsync(TipoEvento tipo, string? query = null,
        Guid? socioId = null, Guid? usuarioId = null,
        string? ip = null, string? userAgent = null)
    {
        var log = new LogActividad
        {
            TipoEvento = tipo,
            Fecha = DateTime.UtcNow,
            Query = query,
            SocioId = socioId,
            UsuarioId = usuarioId,
            Ip = ip,
            UserAgent = userAgent
        };

        await _repo.AddAsync(log);
        _logger.LogInformation("Log: {Tipo} | Query: {Query} | SocioId: {SocioId}",
            tipo, query, socioId);
    }
}
