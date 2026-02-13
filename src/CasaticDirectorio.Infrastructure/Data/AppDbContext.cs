using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Data;

/// <summary>
/// DbContext principal. Configura tablas, índices GIN para 
/// Full-Text Search y relaciones.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options) { }

    // DbSets = Tablas
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Socio> Socios => Set<Socio>();
    public DbSet<LogActividad> LogsActividad => Set<LogActividad>();
    public DbSet<FormularioContacto> FormulariosContacto => Set<FormularioContacto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── USUARIO ──────────────────────────────────
        modelBuilder.Entity<Usuario>(e =>
        {
            e.ToTable("usuarios");
            e.HasKey(u => u.Id);
            e.Property(u => u.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.PasswordHash).IsRequired();
            // Guardar el enum como string en la BD
            e.Property(u => u.Rol)
                .HasConversion<string>()
                .HasMaxLength(20);
            e.Property(u => u.CreatedAt).HasDefaultValueSql("now()");
        });

        // ── SOCIO ────────────────────────────────────
        modelBuilder.Entity<Socio>(e =>
        {
            e.ToTable("socios");
            e.HasKey(s => s.Id);
            e.Property(s => s.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(s => s.NombreEmpresa)
                .HasMaxLength(300).IsRequired();
            e.Property(s => s.Slug)
                .HasMaxLength(300).IsRequired();
            e.HasIndex(s => s.Slug).IsUnique();
            e.Property(s => s.Descripcion).HasColumnType("text");
            e.Property(s => s.RedesSociales).HasColumnType("jsonb");
            e.Property(s => s.EstadoFinanciero)
                .HasConversion<string>()
                .HasMaxLength(20);
            e.Property(s => s.CreatedAt).HasDefaultValueSql("now()");
            e.Property(s => s.UpdatedAt).HasDefaultValueSql("now()");

            // ★ Full-Text Search: columna tsvector computada
            // PostgreSQL calcula automáticamente el vector de búsqueda
            // usando el diccionario 'spanish' a partir del nombre y descripción
            e.Property(s => s.SearchVector)
             .HasColumnType("tsvector")
             .HasComputedColumnSql(
                 "to_tsvector('spanish', coalesce(\"NombreEmpresa\",'') " +
                 "|| ' ' || coalesce(\"Descripcion\",''))",
                 stored: true);

            // ★ Índice GIN: hace las búsquedas full-text ultra rápidas
            e.HasIndex(s => s.SearchVector).HasMethod("GIN");

            // ★ Arrays nativos de PostgreSQL (text[])
            e.Property(s => s.Especialidades).HasColumnType("text[]");
            e.Property(s => s.Servicios).HasColumnType("text[]");
        });

        // ── LOG ACTIVIDAD ────────────────────────────
        modelBuilder.Entity<LogActividad>(e =>
        {
            e.ToTable("logs_actividad");
            e.HasKey(l => l.Id);
            e.Property(l => l.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(l => l.TipoEvento)
                .HasConversion<string>()
                .HasMaxLength(30);
            e.Property(l => l.Fecha).HasDefaultValueSql("now()");

            // Relación: muchos logs → un socio (opcional)
            e.HasOne(l => l.Socio)
             .WithMany(s => s.Logs)
             .HasForeignKey(l => l.SocioId)
             .OnDelete(DeleteBehavior.SetNull);

            // Índices para consultas de reportes
            e.HasIndex(l => l.Fecha);
            e.HasIndex(l => l.TipoEvento);
        });

        // ── FORMULARIO CONTACTO ──────────────────────
        modelBuilder.Entity<FormularioContacto>(e =>
        {
            e.ToTable("formularios_contacto");
            e.HasKey(f => f.Id);
            e.Property(f => f.Id).HasDefaultValueSql("gen_random_uuid()");
            e.Property(f => f.Nombre).HasMaxLength(200).IsRequired();
            e.Property(f => f.Correo).HasMaxLength(256).IsRequired();
            e.Property(f => f.Mensaje).HasColumnType("text").IsRequired();
            e.Property(f => f.Fecha).HasDefaultValueSql("now()");

            // Relación: muchos formularios → un socio
            // CASCADE: si se borra el socio, se borran sus formularios
            e.HasOne(f => f.Socio)
             .WithMany(s => s.Formularios)
             .HasForeignKey(f => f.SocioId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}