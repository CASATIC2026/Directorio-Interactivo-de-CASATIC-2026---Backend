using CasaticDirectorio.Api.DTOs.Reportes;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Dashboard de métricas y reportería — Solo Admin.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ReportesController : ControllerBase
{
    private readonly ILogActividadRepository _logs;
    private readonly IFormularioContactoRepository _formularios;
    private readonly AppDbContext _db;

    public ReportesController(
        ILogActividadRepository logs,
        IFormularioContactoRepository formularios,
        AppDbContext db)
    {
        _logs = logs;
        _formularios = formularios;
        _db = db;
    }

    /// <summary>
    /// Obtener métricas del dashboard administrativo.
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var ahora = DateTime.UtcNow;
        var inicioSemana = ahora.AddDays(-7);
        var inicioMes = ahora.AddDays(-30);

        // Visitas semanales y mensuales
        var visitasSemana = await _logs.CountByTipoAsync(
            TipoEvento.VisitaMicroSitio, inicioSemana, ahora);
        var visitasMes = await _logs.CountByTipoAsync(
            TipoEvento.VisitaMicroSitio, inicioMes, ahora);

        // Búsquedas del mes
        var busquedasMes = await _logs.CountByTipoAsync(
            TipoEvento.Busqueda, inicioMes, ahora);

        // Formularios del mes
        var formulariosMes = await _formularios.CountAsync(inicioMes, ahora);

        // Conteo de socios
        var totalSocios = await _db.Socios.CountAsync();
        var sociosActivos = await _db.Socios.CountAsync(s =>
            s.Habilitado && s.EstadoFinanciero == EstadoFinanciero.AlDia);
        var sociosEnMora = await _db.Socios.CountAsync(s =>
            s.EstadoFinanciero == EstadoFinanciero.EnMora);

        // Logins por usuario
        var loginsPorUsuario = await _logs.GetLoginsPorUsuarioAsync(inicioMes, ahora);

        // Visitas diarias (últimos 30 días) — traer a memoria para agrupar
        var visitasRaw = await _db.LogsActividad
            .Where(l => l.TipoEvento == TipoEvento.VisitaMicroSitio && l.Fecha >= inicioMes)
            .Select(l => l.Fecha)
            .ToListAsync();

        var visitasDiarias = visitasRaw
            .GroupBy(f => f.Date)
            .Select(g => new VisitaDiariaDto
            {
                Fecha = g.Key.ToString("yyyy-MM-dd"),
                Cantidad = g.Count()
            })
            .OrderBy(v => v.Fecha)
            .ToList();

        return Ok(new DashboardDto
        {
            VisitasSemana = visitasSemana,
            VisitasMes = visitasMes,
            BusquedasMes = busquedasMes,
            FormulariosMes = formulariosMes,
            TotalSocios = totalSocios,
            SociosActivos = sociosActivos,
            SociosEnMora = sociosEnMora,
            LoginsPorUsuario = loginsPorUsuario,
            VisitasDiarias = visitasDiarias
        });
    }

    /// <summary>
    /// Listar búsquedas realizadas en un rango de fechas.
    /// </summary>
    [HttpGet("busquedas")]
    public async Task<IActionResult> GetBusquedas(
        [FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        var d = desde ?? DateTime.UtcNow.AddDays(-30);
        var h = hasta ?? DateTime.UtcNow;

        var logs = await _logs.GetByTipoAsync(TipoEvento.Busqueda, d, h);
        return Ok(logs.Select(l => new { l.Fecha, l.Query, l.Ip }));
    }

    /// <summary>
    /// Listar formularios recibidos en un rango de fechas.
    /// </summary>
    [HttpGet("formularios")]
    public async Task<IActionResult> GetFormularios(
        [FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        var d = desde ?? DateTime.UtcNow.AddDays(-30);
        var h = hasta ?? DateTime.UtcNow;

        var formularios = await _formularios.GetAllAsync(d, h);
        return Ok(formularios.Select(f => new
        {
            f.Id,
            f.Nombre,
            f.Correo,
            f.Mensaje,
            f.Fecha,
            Socio = f.Socio?.NombreEmpresa
        }));
    }
}
