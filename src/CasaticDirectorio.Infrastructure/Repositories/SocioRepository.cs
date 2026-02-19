using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;    

namespace CasaticDirectorio.Infrastructure.Repositories;

public class SocioRepository : ISocioRepository
{
    private readonly AppDbContext _db;
    public SocioRepository(AppDbContext db) => _db = db;

    public async Task<Socio?> GetByIdAsync(Guid id) =>
        await _db.Socios.FindAsync(id);

    public async Task<Socio?> GetBySlugAsync(string slug) =>
        await _db.Socios.FirstOrDefaultAsync(s => s.Slug == slug);

    /// <summary>
    /// Búsqueda paginada con Full-Text Search (PostgreSQL to_tsquery)
    /// y filtro opcional por especialidad.
    /// </summary>
    public async Task<(List<Socio> Items, int Total)> SearchAsync(
        string? query, string? especialidad, string? servicio, int page, int pageSize)
    {
        var q = _db.Socios.AsQueryable();

        // Solo mostrar socios habilitados y al día en el portal público
        q = q.Where(s => s.Habilitado && s.EstadoFinanciero == Domain.Enums.EstadoFinanciero.AlDia);

        // Full-Text Search con índice GIN
        if (!string.IsNullOrWhiteSpace(query))
        {
            var tsQuery = EF.Functions.ToTsQuery("spanish", string.Join(" & ", query.Trim().Split(' ')));
            q = q.Where(s => s.SearchVector!.Matches(tsQuery));
        }

        // Filtro por especialidad (ANY en el array PostgreSQL)
        if (!string.IsNullOrWhiteSpace(especialidad))
        {
            q = q.Where(s => s.Especialidades.Contains(especialidad));
        }

        // Filtro por servicio (ANY en el array PostgreSQL)
        if (!string.IsNullOrWhiteSpace(servicio))
        {
            q = q.Where(s => s.Servicios.Contains(servicio));
        }

        var total = await q.CountAsync();

        var items = await q
            .OrderBy(s => s.NombreEmpresa)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<List<Socio>> GetAllAsync() =>
        await _db.Socios.OrderBy(s => s.NombreEmpresa).ToListAsync();

    public async Task AddAsync(Socio socio)
    {
        _db.Socios.Add(socio);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Socio socio)
    {
        socio.UpdatedAt = DateTime.UtcNow;
        _db.Socios.Update(socio);
        await _db.SaveChangesAsync();
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
