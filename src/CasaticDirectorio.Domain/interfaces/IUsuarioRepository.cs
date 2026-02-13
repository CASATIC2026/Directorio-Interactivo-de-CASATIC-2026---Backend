using System.Threading.Tasks;
using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Domain.Interfaces;


public interface IUsuarioRepository
{
Task<Usuario?> GetByEmailAsync(string email);
Task<Usuario?> GetByIdAsync(Guid id);

Task <List<Usuario>> GetAllAsync();
Task<Usuario> CreateAsync(Usuario usuario);
Task<Usuario> UpdateAsync(Usuario usuario);
Task DeleteAsync(Guid id);

}