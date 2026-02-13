public class LogActividad
{
    public Guid Id { get; set; }
    public TipoEvento TipoEvento { get; set; }
    public Guid? SocioId { get; set; }
    public Guid? UsuarioId { get; set; }
    public string? Query { get; set; }
    public string? IpAddress { get; set; }
    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    // Navegación
    public Socio? Socio { get; set; }
}