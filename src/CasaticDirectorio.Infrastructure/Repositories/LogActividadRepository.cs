using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Repositories;

public class LogActividadRepository : ILogActividadRepository
{
    private readonly AppDbContext _db;

    public LogActividadRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(LogActividad log)
    {
        _db.LogsActividad.Add(log);
        await _db.SaveChangesAsync();
    }

    public async Task<List<LogActividad>> GetRecentAsync(int count = 50)
        => await _db.LogsActividad
            .OrderByDescending(l => l.Fecha)
            .Take(count)
            .ToListAsync();

    public async Task<int> CountByTipoAsync(
        string tipo, DateTime? desde = null)
    {
        var q = _db.LogsActividad
            .Where(l => l.TipoEvento.ToString() == tipo);

        if (desde.HasValue)
            q = q.Where(l => l.Fecha >= desde.Value);

        return await q.CountAsync();
    }

    public async Task<List<LogActividad>> GetByFechaRangeAsync(
        DateTime desde, DateTime hasta)
        => await _db.LogsActividad
            .Where(l => l.Fecha >= desde && l.Fecha <= hasta)
            .OrderBy(l => l.Fecha)
            .ToListAsync();
}