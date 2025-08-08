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

            // Create DTO -> Entity
            CreateMap<CreatePropertyRequest, Property>()
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Location))
                .ForMember(d => d.ListingType, o => o.Ignore())
                .ForMember(d => d.Bedrooms, o => o.Ignore())
                .ForMember(d => d.Bathrooms, o => o.Ignore())
                .ForMember(d => d.CarSpots, o => o.Ignore())
                .ForMember(d => d.FavoritedBy, o => o.Ignore());

            // Update DTO -> Entity (in-place update)
            CreateMap<UpdatePropertyRequest, Property>()
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.Address, o => o.MapFrom(s => s.Location))
                .ForMember(d => d.ListingType, o => o.Ignore())
                .ForMember(d => d.Bedrooms, o => o.Ignore())
                .ForMember(d => d.Bathrooms, o => o.Ignore())
                .ForMember(d => d.CarSpots, o => o.Ignore())
                .ForMember(d => d.FavoritedBy, o => o.Ignore());
        }
    }
}
