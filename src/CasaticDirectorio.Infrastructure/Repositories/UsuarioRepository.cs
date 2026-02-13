using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _db;

    public UsuarioRepository(AppDbContext db) => _db = db;

    public async Task<Usuario?> GetByEmailAsync(string email)
        => await _db.Usuarios.FirstOrDefaultAsync(
            u => u.Email.ToLower() == email.ToLower());

    public async Task<Usuario?> GetByIdAsync(Guid id)
        => await _db.Usuarios.FindAsync(id);

    public async Task<List<Usuario>> GetAllAsync()
        => await _db.Usuarios.OrderBy(u => u.Email).ToListAsync();

    public async Task<Usuario> CreateAsync(Usuario usuario)
    {
        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();
        return usuario;
    }

    public async Task<Usuario> UpdateAsync(Usuario usuario)
    {
        _db.Usuarios.Update(usuario);
        await _db.SaveChangesAsync();
        return usuario;
    }
}