using CasaticDirectorio.Api.DTOs.Formulario;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Formulario de contacto público — enviar mensaje a un socio.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class FormularioContactoController : ControllerBase
{
    private readonly IFormularioContactoRepository _formularios;
    private readonly ISocioRepository _socios;
    private readonly ILogService _logService;

    public FormularioContactoController(
        IFormularioContactoRepository formularios,
        ISocioRepository socios,
        ILogService logService)
    {
        _formularios = formularios;
        _socios = socios;
        _logService = logService;
    }

    /// <summary>
    /// Enviar formulario de contacto a un socio.
    /// POST /api/formulariocontacto/{socioId}
    /// </summary>
    [HttpPost("{socioId:guid}")]
    public async Task<IActionResult> Enviar(Guid socioId, [FromBody] FormularioContactoDto dto)
    {
        var socio = await _socios.GetByIdAsync(socioId);
        if (socio == null || !socio.Habilitado)
            return NotFound(new { message = "Socio no encontrado o deshabilitado" });

        var formulario = new FormularioContacto
        {
            Id = Guid.NewGuid(),
            SocioId = socioId,
            Nombre = dto.Nombre,
            Correo = dto.Correo,
            Mensaje = dto.Mensaje,
            Fecha = DateTime.UtcNow
        };

        await _formularios.AddAsync(formulario);

        // Registrar envío de formulario
        await _logService.RegistrarAsync(
            TipoEvento.EnvioFormulario,
            socioId: socioId,
            ip: HttpContext.Connection.RemoteIpAddress?.ToString(),
            userAgent: Request.Headers.UserAgent.ToString());

        return Ok(new { message = "Formulario enviado con éxito", id = formulario.Id });
    }

    /// <summary>
    /// Listar formularios recibidos por un socio (admin).
    /// </summary>
    [HttpGet("socio/{socioId:guid}")]
    public async Task<IActionResult> GetBySocio(Guid socioId)
    {
        var formularios = await _formularios.GetBySocioAsync(socioId);
        return Ok(formularios.Select(f => new
        {
            f.Id,
            f.Nombre,
            f.Correo,
            f.Mensaje,
            f.Fecha
        }));
    }
}
