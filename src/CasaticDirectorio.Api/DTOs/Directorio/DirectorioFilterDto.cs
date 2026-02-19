namespace CasaticDirectorio.Api.DTOs.Directorio;

public class DirectorioFilterDto
{
    /// <summary>
    /// Texto de búsqueda (Full-Text Search).
    /// </summary>
    public string? Query { get; set; }

    /// <summary>
    /// Filtrar por especialidad.
    /// </summary>
    public string? Especialidad { get; set; }

    /// <summary>
    /// Filtrar por servicio.
    /// </summary>
    public string? Servicio { get; set; }

    /// <summary>
    /// Filtrar por producto/marca representada.
    /// </summary>
    public string? Producto { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
