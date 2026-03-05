using System.Text;
using CasaticDirectorio.Api.Mapping;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using CasaticDirectorio.Infrastructure.Data.Seed;
using CasaticDirectorio.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using CasaticDirectorio.Api.Middleware;

// ══════════════════════════════════════════════════════════════
// Program.cs — Directorio Interactivo CASATIC 2026
// ══════════════════════════════════════════════════════════════

var builder = WebApplication.CreateBuilder(args);

// ── Serilog ──────────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();
builder.Host.UseSerilog();

// ── PostgreSQL + EF Core ─────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Repositorios (DI) ────────────────────────────────────────
builder.Services.AddScoped<ISocioRepository, SocioRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ILogActividadRepository, LogActividadRepository>();
builder.Services.AddScoped<IFormularioContactoRepository, FormularioContactoRepository>();

// ── Servicios ────────────────────────────────────────────────
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ILogService, LogService>();

// ── AutoMapper ───────────────────────────────────────────────
builder.Services.AddAutoMapper(typeof(MappingProfile));

// ── JWT Authentication ───────────────────────────────────────
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddHealthChecks();

// ── Controllers ──────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// ── Swagger / OpenAPI ────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Directorio Interactivo CASATIC 2026",
        Version = "v1",
        Description = "API para el directorio de socios de CASATIC"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "Ingrese 'Bearer {token}'"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ── CORS ─────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:80")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ── Migraciones automáticas + Seed ───────────────────────────
// En desarrollo: EnsureCreated crea las tablas si no existen.
// En producción: usar MigrateAsync con migraciones generadas.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var env = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();

    if (env.IsDevelopment())
    {
        await db.Database.EnsureCreatedAsync();
    }
    else
    {
        await db.Database.MigrateAsync();
    }

    // Compatibilidad de esquema para entornos existentes sin migraciones.
    // EnsureCreated no aplica cambios sobre tablas ya creadas.
    await db.Database.ExecuteSqlRawAsync(@"
        ALTER TABLE IF EXISTS socios
        ADD COLUMN IF NOT EXISTS ""MarcasRepresenta"" text NOT NULL DEFAULT '';
    ");

    await DataSeeder.SeedAsync(db);
}

// ── Middleware Pipeline ──────────────────────────────────────
app.UseMiddleware<ApiExceptionMiddleware>();
app.UseSerilogRequestLogging();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CASATIC API v1"));

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

Log.Information("🚀 Directorio Interactivo CASATIC 2026 iniciado");
app.Run();
