using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Domain.Interfaces;

public interface ISocioRepository
{
    Task<Socio?> GetByIdAsync(Guid id);
    Task<Socio?> GetBySlugAsync(string slug);
    Task<(List<Socio> Items, int Total)> SearchAsync(
        string? query, string? especialidad, string? servicio, string? producto, int page, int pageSize);
    Task<List<Socio>> GetAllAsync();
    Task AddAsync(Socio socio);
    Task UpdateAsync(Socio socio);
    Task DeleteAsync(Guid id);
}
