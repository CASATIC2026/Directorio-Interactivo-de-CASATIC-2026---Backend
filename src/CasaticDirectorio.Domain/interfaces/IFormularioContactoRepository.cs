using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Domain.Interfaces
{
    public interface IFormularioContactoRepository
    {
       Task<FormularioContacto> CreateAsync(FormularioContacto formulario);
       Task<List<FormularioContacto>> GetBySocioAsync(Guid socioId);
       Task<int> CountAsync(DateTime? desde = null);
    }
}