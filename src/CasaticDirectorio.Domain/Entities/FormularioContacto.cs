
namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Formulario de contacto enviado por un visitante a un socio.
/// </summary>
public class FormularioContacto
{
    public Guid Id { get; set; }
    public Guid SocioId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;
    public bool Leido { get; set; } = false;
    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    // Navegación
    public Socio? Socio { get; set; }
}