using AutoMapper;
using CasaticDirectorio.Api.DTOs.Socios;
using CasaticDirectorio.Api.DTOs.Usuarios;
using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Api.Mapping;

/// <summary>
/// Perfil de AutoMapper: mapeos entre entidades y DTOs.
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Socio → SocioDto
        CreateMap<Socio, SocioDto>()
            .ForMember(d => d.EstadoFinanciero,
                opt => opt.MapFrom(s => s.EstadoFinanciero.ToString()));

        // Socio → SocioListDto
        CreateMap<Socio, SocioListDto>();

        // SocioCreateDto → Socio
        CreateMap<SocioCreateDto, Socio>();

        // Usuario → UsuarioDto
        CreateMap<Usuario, UsuarioDto>()
            .ForMember(d => d.Rol, opt => opt.MapFrom(s => s.Rol.ToString()))
            .ForMember(d => d.NombreEmpresa,
                opt => opt.MapFrom(s => s.Socio != null ? s.Socio.NombreEmpresa : null));
    }
}
