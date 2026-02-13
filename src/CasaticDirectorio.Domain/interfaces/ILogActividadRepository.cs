using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Domain.Interfaces;

public interface ILogActividadRepository
{
    Task AddAsync(LogActividad log);
    Task<List<LogActividad>> GetRecentAsync(int count = 50);
    Task<int> CountByTipoAsync(string tipo, DateTime? desde, DateTime hasta);
}

