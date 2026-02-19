using AutoMapper;
using CasaticDirectorio.Api.DTOs.Usuarios;
using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Gestión de usuarios — Solo Admin.
/// Permite crear usuarios socio con contraseña genérica.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioRepository _usuarios;
    private readonly IMapper _mapper;

    public UsuariosController(IUsuarioRepository usuarios, IMapper mapper)
    {
        _usuarios = usuarios;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var usuarios = await _usuarios.GetAllAsync();
        return Ok(_mapper.Map<List<UsuarioDto>>(usuarios));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var usuario = await _usuarios.GetByIdAsync(id);
        if (usuario == null) return NotFound();
        return Ok(_mapper.Map<UsuarioDto>(usuario));
    }

    /// <summary>
    /// Crear usuario socio con contraseña genérica (Socio123!).
    /// El usuario DEBE cambiarla en su primer login.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UsuarioCreateDto dto)
    {
        // Verificar que no exista
        var existing = await _usuarios.GetByEmailAsync(dto.Email);
        if (existing != null)
            return Conflict(new { message = "Ya existe un usuario con ese email" });

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Socio123!"),
            Rol = Enum.Parse<Rol>(dto.Rol),
            PrimerLogin = true,
            Activo = true,
            SocioId = dto.SocioId
        };

        await _usuarios.AddAsync(usuario);

        return CreatedAtAction(nameof(GetById), new { id = usuario.Id },
            _mapper.Map<UsuarioDto>(usuario));
    }

    /// <summary>
    /// Activar/desactivar un usuario.
    /// </summary>
    [HttpPatch("{id:guid}/toggle-activo")]
    public async Task<IActionResult> ToggleActivo(Guid id)
    {
        var usuario = await _usuarios.GetByIdAsync(id);
        if (usuario == null) return NotFound();

        usuario.Activo = !usuario.Activo;
        await _usuarios.UpdateAsync(usuario);

        return Ok(new { usuario.Activo });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _usuarios.DeleteAsync(id);
        return NoContent();
    }
}
