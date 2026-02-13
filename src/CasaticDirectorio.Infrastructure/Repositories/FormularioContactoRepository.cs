using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Repositories;

public class FormularioContactoRepository : IFormularioContactoRepository
{
    private readonly AppDbContext _db;

    public FormularioContactoRepository(AppDbContext db) => _db = db;

    public async Task<FormularioContacto> CreateAsync(
        FormularioContacto formulario)
    {
        _db.FormulariosContacto.Add(formulario);
        await _db.SaveChangesAsync();
        return formulario;
    }

    public async Task<List<FormularioContacto>> GetBySocioIdAsync(
        Guid socioId)
        => await _db.FormulariosContacto
            .Where(f => f.SocioId == socioId)
            .OrderByDescending(f => f.Fecha)
            .ToListAsync();

    public async Task<int> CountAsync(DateTime? desde = null)
    {
        var q = _db.FormulariosContacto.AsQueryable();
        if (desde.HasValue)
            q = q.Where(f => f.Fecha >= desde.Value);
        return await q.CountAsync();
    }
}