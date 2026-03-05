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
                NombreEmpresa = "Applaudo Studios",
                Slug = "applaudo-studios-el-salvador",
                Descripcion = "Empresa salvadoreña de desarrollo de software enfocada en productos digitales, ingeniería de calidad y equipos de alto rendimiento para clientes globales.",
                Especialidades = new List<string> { "Desarrollo de Software", "QA", "DevOps" },
                Servicios = new List<string> { "Desarrollo a medida", "Staff Augmentation", "Consultoría TI" },
                RedesSociales = "{\"facebook\":\"https://facebook.com/applaudostudios\",\"linkedin\":\"https://linkedin.com/company/applaudo\",\"website\":\"https://applaudo.com\"}",
                Telefono = "+503 2506-9000",
                Direccion = "San Salvador, El Salvador",
                LogoUrl = "/logos/applaudo.png",
                MarcasRepresenta = "AWS, Azure, Google Cloud",
                EstadoFinanciero = EstadoFinanciero.AlDia,
                Habilitado = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "Elaniin",
                Slug = "elaniin-el-salvador",
                Descripcion = "Compañía tecnológica y de productos digitales de El Salvador, reconocida por diseño, desarrollo web, apps y soluciones para marcas regionales e internacionales.",
                Especialidades = new List<string> { "Desarrollo Web", "UX UI", "Aplicaciones Móviles" },
                Servicios = new List<string> { "Diseño de Producto", "Desarrollo Full Stack", "Transformación Digital" },
                RedesSociales = "{\"facebook\":\"https://facebook.com/elaniin\",\"linkedin\":\"https://linkedin.com/company/elaniin\",\"website\":\"https://elaniin.com\"}",
                Telefono = "+503 2121-2100",
                Direccion = "San Salvador, El Salvador",
                LogoUrl = "/logos/elaniin.png",
                MarcasRepresenta = "Figma, Shopify, AWS",
                EstadoFinanciero = EstadoFinanciero.AlDia,
                Habilitado = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "Tigo El Salvador",
                Slug = "tigo-el-salvador",
                Descripcion = "Empresa líder en telecomunicaciones y servicios digitales en El Salvador, con soluciones de conectividad, nube y servicios empresariales.",
                Especialidades = new List<string> { "Telecomunicaciones", "Infraestructura", "Servicios Digitales" },
                Servicios = new List<string> { "Internet Empresarial", "Soluciones Cloud", "Ciberseguridad" },
                RedesSociales = "{\"facebook\":\"https://facebook.com/TigoElSalvador\",\"linkedin\":\"https://linkedin.com/company/tigo-el-salvador\",\"website\":\"https://www.tigo.com.sv\"}",
                Telefono = "+503 2207-0000",
                Direccion = "San Salvador, El Salvador",
                LogoUrl = "/logos/tigo.png",
                MarcasRepresenta = "Millicom, Huawei, Cisco",
                EstadoFinanciero = EstadoFinanciero.EnMora,
                Habilitado = false // En mora → deshabilitado
            },
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "Claro El Salvador",
                Slug = "claro-el-salvador",
                Descripcion = "Proveedor tecnológico y de telecomunicaciones con amplia cobertura en El Salvador para servicios móviles, internet, datos y soluciones corporativas.",
                Especialidades = new List<string> { "Conectividad", "Telecom", "Servicios Empresariales" },
                Servicios = new List<string> { "Enlaces Dedicados", "Data Center", "Telefonía Empresarial" },
                RedesSociales = "{\"facebook\":\"https://facebook.com/ClaroElSalvador\",\"linkedin\":\"https://linkedin.com/company/claro-el-salvador\",\"website\":\"https://www.claro.com.sv\"}",
                Telefono = "+503 2205-0000",
                Direccion = "San Salvador, El Salvador",
                LogoUrl = "/logos/claro.png",
                MarcasRepresenta = "América Móvil, Huawei, Ericsson",
                EstadoFinanciero = EstadoFinanciero.AlDia,
                Habilitado = true
            },
            new()
            {
                Id = Guid.NewGuid(),
                NombreEmpresa = "GBM El Salvador",
                Slug = "gbm-el-salvador",
                Descripcion = "Compañía de soluciones tecnológicas empresariales en El Salvador con foco en nube, ciberseguridad, infraestructura y servicios administrados.",
                Especialidades = new List<string> { "Infraestructura TI", "Nube", "Ciberseguridad" },
                Servicios = new List<string> { "Modernización de TI", "Servicios Administrados", "Consultoría" },
                RedesSociales = "{\"linkedin\":\"https://linkedin.com/company/gbm\",\"website\":\"https://www.gbm.net\"}",
                Telefono = "+503 2500-6800",
                Direccion = "Antiguo Cuscatlán, La Libertad, El Salvador",
                LogoUrl = "/logos/gbm.png",
                MarcasRepresenta = "IBM, Cisco, Red Hat",
                EstadoFinanciero = EstadoFinanciero.AlDia,
                Habilitado = true
            }
        };

        db.Socios.AddRange(socios);

        // ── Usuarios de empresa (rol Usuario, contraseña genérica: Socio123!) ──────
        foreach (var socio in socios)
        {
            db.Usuarios.Add(new Usuario
            {
                Id = Guid.NewGuid(),
                Email = $"contacto@{socio.Slug.Replace("-", "")}.sv",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Socio123!"),
                Rol = Rol.Usuario,
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
