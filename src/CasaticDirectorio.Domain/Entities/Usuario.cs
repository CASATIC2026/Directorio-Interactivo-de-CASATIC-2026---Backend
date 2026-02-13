using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Usuario del backoffice del directorio(administrador o socio).
/// </summary>
public class Usuario
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public Rol Rol { get; set; } = Rol.Socio;
    public bool Activo { get; set; } = true;

    /// <summary>
/// si true, al proximo login se fuerza el cambio de contraseña.
/// </summary>
public bool PrimerLogin { get; set; } = true;
public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}

