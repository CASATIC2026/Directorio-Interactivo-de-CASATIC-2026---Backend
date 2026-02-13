using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Domain.Interfaces;

public interface ISocioRepository
{
 Task<(List<Socio> Items, int Total)> SearchAsync(
        string? query, string? especialidad, int page, int pageSize);
        Task<Socio?> GetBySlugAsync(string slug);
        Task<Socio?> GetByIdAsync(Guid id);
        Task<List<Socio>> GetAllAsync();
        Task AddAsync(Socio socio);
        Task UpdateAsync(Socio socio);
        Task DeleteAsync(Guid id);
        }

        