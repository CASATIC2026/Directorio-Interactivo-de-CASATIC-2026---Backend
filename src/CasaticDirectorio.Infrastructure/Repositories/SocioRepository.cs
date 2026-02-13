using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using NpgsqlTypes;

namespace CasaticDirectorio.Infrastructure.Repositories;

public class SocioRepository : ISocioRepository
{
    private readonly AppDbContext _db;

    public SocioRepository(AppDbContext db) => _db = db;

    public async Task<(List<Socio> Items, int Total)> SearchAsync(
        string? query, string? especialidad, int page, int pageSize)
    {
        // Base: solo socios habilitados y al día
        var q = _db.Socios.AsQueryable()
            .Where(s => s.Habilitado && 
                        s.EstadoFinanciero == EstadoFinanciero.AlDia);

        // ★ Full-Text Search con el operador @@ de PostgreSQL
        if (!string.IsNullOrWhiteSpace(query))
        {
            q = q.Where(s => s.SearchVector!.Matches(
                EF.Functions.PlainToTsQuery("spanish", query)));
        }

        // Filtro por especialidad (buscar dentro del array text[])
        if (!string.IsNullOrWhiteSpace(especialidad))
        {
            q = q.Where(s => s.Especialidades.Contains(especialidad));
        }

        var total = await q.CountAsync();
        var items = await q
            .OrderBy(s => s.NombreEmpresa)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<Socio?> GetBySlugAsync(string slug)
        => await _db.Socios.FirstOrDefaultAsync(s => s.Slug == slug);

    public async Task<Socio?> GetByIdAsync(Guid id)
        => await _db.Socios.FindAsync(id);

    public async Task<List<Socio>> GetAllAsync()
        => await _db.Socios.OrderBy(s => s.NombreEmpresa).ToListAsync();

    public async Task<Socio> CreateAsync(Socio socio)
    {
        _db.Socios.Add(socio);
        await _db.SaveChangesAsync();
        return socio;
    }

    public async Task<Socio> UpdateAsync(Socio socio)
    {
        socio.UpdatedAt = DateTime.UtcNow;
        _db.Socios.Update(socio);
        await _db.SaveChangesAsync();
        return socio;
    }

    public async Task DeleteAsync(Guid id)
    {
        var socio = await _db.Socios.FindAsync(id);
        if (socio != null)
        {
            _db.Socios.Remove(socio);
            await _db.SaveChangesAsync();
        }
    }
}