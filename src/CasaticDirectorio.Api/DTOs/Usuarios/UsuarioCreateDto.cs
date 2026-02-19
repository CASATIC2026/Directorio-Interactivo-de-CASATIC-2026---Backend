using System.ComponentModel.DataAnnotations;

namespace CasaticDirectorio.Api.DTOs.Usuarios;

public class UsuarioCreateDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Rol { get; set; } = "Socio";

    /// <summary>
    /// Si el rol es Socio, se debe indicar el socio asociado.
    /// </summary>
    public Guid? SocioId { get; set; }
}
