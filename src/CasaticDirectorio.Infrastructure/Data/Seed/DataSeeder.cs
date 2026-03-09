using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Data.Seed;

/// <summary>
/// Inicializa únicamente el usuario administrador por defecto.
/// No inserta datos de ejemplo — los socios reales se registran desde el panel.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Si ya existe al menos un usuario en la BD, no hacer nada
        if (await db.Usuarios.AnyAsync()) return;

        // ── Administrador por defecto ────────────────────────────
        db.Usuarios.Add(new Usuario
        {
            Id = Guid.NewGuid(),
            Email = "admin@casatic.org",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Rol = Rol.Admin,
            PrimerLogin = false,
            Activo = true
        });

        await db.SaveChangesAsync();
    }
}
