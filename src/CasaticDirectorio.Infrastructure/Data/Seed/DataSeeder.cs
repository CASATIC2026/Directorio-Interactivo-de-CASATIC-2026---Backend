using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Data.Seed;

/// <summary>
/// Semilla de datos de ejemplo para desarrollo y pruebas.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Usuarios.AnyAsync()) return; // Ya hay datos

        // ── Admin por defecto ────────────────────────────────────
        var admin = new Usuario
        {
            Id = Guid.NewGuid(),
            Email = "admin@casatic.org",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Rol = Rol.Admin,
            PrimerLogin = false,
            Activo = true
        };
        db.Usuarios.Add(admin);

        // ── Socios de ejemplo ────────────────────────────────────
        var socios = new List<Socio>
        {
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "TechSolutions Honduras",
                Slug = "techsolutions-honduras",
                Descripcion = "Empresa líder en desarrollo de software a medida, consultoría TI y transformación digital para el sector empresarial centroamericano.",
                Especialidades = new List<string> { "Desarrollo Web", "Cloud Computing", "IA" },
                Servicios = new List<string> { "Desarrollo a medida", "Consultoría TI", "Soporte 24/7" },
                RedesSociales = "{\"facebook\":\"https://facebook.com/techsolutions\",\"linkedin\":\"https://linkedin.com/company/techsolutions\",\"website\":\"https://techsolutions.hn\"}",
                Telefono = "+504 2234-5678",
                Direccion = "Col. Lomas del Guijarro, Tegucigalpa",
                LogoUrl = "/logos/techsolutions.png",
                MarcasRepresenta = "Microsoft Partner, AWS Partner, Google Cloud Partner",
                EstadoFinanciero = EstadoFinanciero.AlDia,
                Habilitado = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "DataCorp Centroamérica",
                Slug = "datacorp-centroamerica",
                Descripcion = "Especialistas en análisis de datos, business intelligence y soluciones de Big Data para empresas de la región.",
                Especialidades = new List<string> { "Big Data", "Business Intelligence", "Machine Learning" },
                Servicios = new List<string> { "Dashboards", "ETL", "Capacitación" },
                RedesSociales = "{\"linkedin\":\"https://linkedin.com/company/datacorp\",\"website\":\"https://datacorp.hn\"}",
                Telefono = "+504 2245-6789",
                Direccion = "Blvd. Morazán, San Pedro Sula",
                LogoUrl = "/logos/datacorp.png",
                MarcasRepresenta = "Tableau, Power BI, Snowflake",
                EstadoFinanciero = EstadoFinanciero.AlDia,
                Habilitado = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "CyberGuard HN",
                Slug = "cyberguard-hn",
                Descripcion = "Proveedor de soluciones integrales de ciberseguridad, ethical hacking y cumplimiento normativo ISO 27001.",
                Especialidades = new List<string> { "Ciberseguridad", "Ethical Hacking", "Compliance" },
                Servicios = new List<string> { "Pentesting", "SOC", "Auditoría" },
                RedesSociales = "{\"twitter\":\"https://twitter.com/cyberguardhn\",\"website\":\"https://cyberguard.hn\"}",
                Telefono = "+504 2256-7890",
                Direccion = "Col. Palmira, Tegucigalpa",
                LogoUrl = "/logos/cyberguard.png",
                MarcasRepresenta = "Fortinet, Palo Alto Networks, CrowdStrike",
                EstadoFinanciero = EstadoFinanciero.EnMora,
                Habilitado = false // En mora → deshabilitado
            },
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "CloudNet Solutions",
                Slug = "cloudnet-solutions",
                Descripcion = "Infraestructura cloud, migración y servicios administrados en AWS, Azure y Google Cloud para PYMES.",
                Especialidades = new List<string> { "Cloud", "DevOps", "Infraestructura" },
                Servicios = new List<string> { "Migración Cloud", "IaaS", "Monitoreo" },
                RedesSociales = "{\"linkedin\":\"https://linkedin.com/company/cloudnet\",\"website\":\"https://cloudnet.hn\"}",
                Telefono = "+504 2267-8901",
                Direccion = "Torre Corporativa, La Ceiba",
                LogoUrl = "/logos/cloudnet.png",
                MarcasRepresenta = "Amazon Web Services, Microsoft Azure, Google Cloud",
                EstadoFinanciero = EstadoFinanciero.AlDia,
                Habilitado = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "EduTech Honduras",
                Slug = "edutech-honduras",
                Descripcion = "Plataformas educativas, e-learning y capacitación tecnológica para instituciones públicas y privadas.",
                Especialidades = new List<string> { "EdTech", "E-Learning", "LMS" },
                Servicios = new List<string> { "Plataformas LMS", "Contenido Digital", "Capacitación" },
                RedesSociales = "{\"facebook\":\"https://facebook.com/edutechhn\",\"website\":\"https://edutech.hn\"}",
                Telefono = "+504 2278-9012",
                Direccion = "Col. Kennedy, Tegucigalpa",
                LogoUrl = "/logos/edutech.png",
                MarcasRepresenta = "Moodle Partner, Canvas, Blackboard",
                EstadoFinanciero = EstadoFinanciero.AlDia,
                Habilitado = true
            }
        };

        db.Socios.AddRange(socios);

        // ── Usuarios socio (contraseña genérica: Socio123!) ──────
        foreach (var socio in socios)
        {
            db.Usuarios.Add(new Usuario
            {
                Id = Guid.NewGuid(),
                Email = $"contacto@{socio.Slug.Replace("-", "")}.hn",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Socio123!"),
                Rol = Rol.Socio,
                PrimerLogin = true, // Debe cambiar contraseña
                Activo = true,
                SocioId = socio.Id
            });
        }

        // ── Logs de ejemplo ──────────────────────────────────────
        var rnd = new Random(42);
        foreach (var socio in socios.Where(s => s.Habilitado))
        {
            for (int i = 0; i < 15; i++)
            {
                db.LogsActividad.Add(new LogActividad
                {
                    TipoEvento = TipoEvento.VisitaMicroSitio,
                    Fecha = DateTime.UtcNow.AddDays(-rnd.Next(0, 30)),
                    SocioId = socio.Id,
                    Ip = "192.168.1." + rnd.Next(1, 255),
                    UserAgent = "Mozilla/5.0 (Seed)"
                });
            }
        }

        for (int i = 0; i < 20; i++)
        {
            db.LogsActividad.Add(new LogActividad
            {
                TipoEvento = TipoEvento.Busqueda,
                Fecha = DateTime.UtcNow.AddDays(-rnd.Next(0, 30)),
                Query = new[] { "cloud", "seguridad", "desarrollo web", "datos", "educación" }[rnd.Next(5)],
                Ip = "10.0.0." + rnd.Next(1, 255),
                UserAgent = "Mozilla/5.0 (Seed)"
            });
        }

        // ── Formularios de contacto de ejemplo ───────────────────
        foreach (var socio in socios.Take(3))
        {
            db.FormulariosContacto.Add(new FormularioContacto
            {
                SocioId = socio.Id,
                Nombre = "Juan Pérez",
                Correo = "juan@ejemplo.com",
                Mensaje = $"Me interesa conocer más sobre los servicios de {socio.NombreEmpresa}.",
                Fecha = DateTime.UtcNow.AddDays(-rnd.Next(0, 15))
            });
        }

        await db.SaveChangesAsync();
    }
}
