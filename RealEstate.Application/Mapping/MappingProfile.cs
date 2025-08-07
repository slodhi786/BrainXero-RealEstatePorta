using AutoMapper;
using RealEstate.Application.DTOs.Properties;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity → DTO
            CreateMap<Property, PropertyDto>();

            // DTO → Entity
            CreateMap<CreatePropertyRequest, Property>();
            CreateMap<UpdatePropertyRequest, Property>();
        }
    }
}
