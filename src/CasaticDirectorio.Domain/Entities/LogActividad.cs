using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Log de actividad: registra búsquedas, visitas, logins y envíos de formularios.
/// </summary>
public class LogActividad
{
    public Guid Id { get; set; }
    public TipoEvento TipoEvento { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Texto de búsqueda (solo para eventos de tipo Busqueda).
    /// </summary>
    public string? Query { get; set; }

    /// <summary>
    /// Socio relacionado (si aplica).
    /// </summary>
    public Guid? SocioId { get; set; }
    public Socio? Socio { get; set; }

    /// <summary>
    /// ID del usuario que generó el evento (si aplica).
    /// </summary>
    public Guid? UsuarioId { get; set; }

    public string? Ip { get; set; }
    public string? UserAgent { get; set; }
}
