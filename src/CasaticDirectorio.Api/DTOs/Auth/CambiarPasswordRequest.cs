using System.ComponentModel.DataAnnotations;

namespace CasaticDirectorio.Api.DTOs.Auth;

public class CambiarPasswordRequest
{
    [Required, MinLength(8)]
    public string NuevaPassword { get; set; } = string.Empty;
}
