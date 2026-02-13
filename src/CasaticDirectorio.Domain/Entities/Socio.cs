using CasaticDirectorio.Domain.Enums;
using NpgsqlTypes;

namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Empresa socia de CASATIC. Entidad principal del directorio.
/// </summary>
public class Socio
{
    public Guid Id { get; set; }
    public string NombreEmpresa { get; set; } = string.Empty;

    /// <summary>
    /// URL-friendly slug único (ej: "techsolutions-hn").
    /// </summary>
    public string Slug { get; set; } = string.Empty;

    public string? Descripcion { get; set; }
    public List<string> Especialidades { get; set; } = new();
    public List<string> Servicios { get; set; } = new();

    // Contacto
    public string? Telefono { get; set; }
    public string? Correo { get; set; }
    public string? SitioWeb { get; set; }
    public string? DireccionFisica { get; set; }

    // Imágenes
    public string? LogoUrl { get; set; }
    public string? ImagenPortadaUrl { get; set; }

    /// <summary>
    /// JSON con redes sociales { "linkedin": "...", "facebook": "..." }
    /// </summary>
    public string? RedesSociales { get; set; }

    public EstadoFinanciero EstadoFinanciero { get; set; } = EstadoFinanciero.AlDia;
    public bool Habilitado { get; set; } = true;

    /// <summary>
    /// Columna tsvector generada por PostgreSQL para Full-Text Search.
    /// No se llena manualmente — la calcula el motor.
    /// </summary>
    public NpgsqlTsVector? SearchVector { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navegación
    public ICollection<LogActividad> Logs { get; set; } = new List<LogActividad>();
    public ICollection<FormularioContacto> Formularios { get; set; } = new List<FormularioContacto>();
}