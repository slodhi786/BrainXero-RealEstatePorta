using AutoMapper;
using RealEstate.Application.DTOs.Properties;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Enums;

namespace RealEstate.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ENTITY -> DTO
            CreateMap<Property, PropertyDto>()
                // Thumbnail fallback to first image
                .ForMember(d => d.ThumbnailUrl,
                    o => o.MapFrom(s => !string.IsNullOrWhiteSpace(s.ThumbnailUrl)
                                        ? s.ThumbnailUrl
                                        : (s.ImageUrls != null && s.ImageUrls.Count > 0 ? s.ImageUrls[0] : null)))
                // Status fallback from ListingType
                .ForMember(d => d.Status,
                    o => o.MapFrom(s => !string.IsNullOrWhiteSpace(s.Status)
                                        ? s.Status
                                        : (s.ListingType == ListingType.Rent ? "For Rent" : "For Sale")))
                // Location fallback
                .ForMember(d => d.Location,
                    o => o.MapFrom(s => !string.IsNullOrWhiteSpace(s.Location)
                                        ? s.Location
                                        : (string.IsNullOrWhiteSpace(s.Address) ? s.City : $"{s.Address}, {s.City}")))
                // IsFavorite is computed elsewhere (service/controller), don't map from entity
                .ForMember(d => d.IsFavorite, o => o.Ignore());

            // CREATE DTO -> ENTITY
            CreateMap<CreatePropertyRequest, Property>()
                .ForMember(d => d.Id, o => o.Ignore())
                // address fallback
                .ForMember(d => d.Address, o => o.MapFrom(s => string.IsNullOrWhiteSpace(s.Address) ? s.Location : s.Address))
                .ForMember(d => d.Location, o => o.MapFrom(s => s.Location))
                .ForMember(d => d.City, o => o.MapFrom(s => s.City))
                .ForMember(d => d.ListingType, o => o.MapFrom(s => s.ListingType))
                .ForMember(d => d.PropertyType, o => o.MapFrom(s => s.PropertyType))
                .ForMember(d => d.Bedrooms, o => o.MapFrom(s => s.Bedrooms ?? 0))
                .ForMember(d => d.Bathrooms, o => o.MapFrom(s => s.Bathrooms ?? 0))
                .ForMember(d => d.CarSpots, o => o.MapFrom(s => s.CarSpots ?? 0))
                .ForMember(d => d.SizeLabel, o => o.MapFrom(s => s.SizeLabel))
                .ForMember(d => d.AreaLabel, o => o.MapFrom(s => s.AreaLabel))
                // status fallback from ListingType
                .ForMember(d => d.Status,
                    o => o.MapFrom(s => !string.IsNullOrWhiteSpace(s.Status)
                                        ? s.Status
                                        : (s.ListingType == ListingType.Rent ? "For Rent" : "For Sale")))
                // thumbnail fallback from first image
                .ForMember(d => d.ThumbnailUrl,
                    o => o.MapFrom(s => !string.IsNullOrWhiteSpace(s.ThumbnailUrl)
                                        ? s.ThumbnailUrl
                                        : (s.ImageUrls != null && s.ImageUrls.Count > 0 ? s.ImageUrls[0] : null)))
                .ForMember(d => d.ImageUrls, o => o.MapFrom(s => s.ImageUrls ?? new List<string>()))
                .ForMember(d => d.Lat, o => o.MapFrom(s => s.Lat))
                .ForMember(d => d.Lng, o => o.MapFrom(s => s.Lng))
                .ForMember(d => d.FavoritedBy, o => o.Ignore());

            // UPDATE DTO -> ENTITY (in-place)
            CreateMap<UpdatePropertyRequest, Property>()
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.Address, o => o.MapFrom(s => string.IsNullOrWhiteSpace(s.Address) ? s.Location : s.Address))
                .ForMember(d => d.Location, o => o.MapFrom(s => s.Location))
                .ForMember(d => d.City, o => o.MapFrom(s => s.City))
                .ForMember(d => d.ListingType, o => o.MapFrom(s => s.ListingType))
                .ForMember(d => d.PropertyType, o => o.MapFrom(s => s.PropertyType))
                .ForMember(d => d.Bedrooms, o => o.MapFrom(s => s.Bedrooms ?? 0))
                .ForMember(d => d.Bathrooms, o => o.MapFrom(s => s.Bathrooms ?? 0))
                .ForMember(d => d.CarSpots, o => o.MapFrom(s => s.CarSpots ?? 0))
                .ForMember(d => d.SizeLabel, o => o.MapFrom(s => s.SizeLabel))
                .ForMember(d => d.AreaLabel, o => o.MapFrom(s => s.AreaLabel))
                .ForMember(d => d.Status,
                    o => o.MapFrom(s => !string.IsNullOrWhiteSpace(s.Status)
                                        ? s.Status
                                        : (s.ListingType == ListingType.Rent ? "For Rent" : "For Sale")))
                .ForMember(d => d.ThumbnailUrl,
                    o => o.MapFrom(s => !string.IsNullOrWhiteSpace(s.ThumbnailUrl)
                                        ? s.ThumbnailUrl
                                        : (s.ImageUrls != null && s.ImageUrls.Count > 0 ? s.ImageUrls[0] : null)))
                .ForMember(d => d.ImageUrls, o => o.MapFrom(s => s.ImageUrls ?? new List<string>()))
                .ForMember(d => d.Lat, o => o.MapFrom(s => s.Lat))
                .ForMember(d => d.Lng, o => o.MapFrom(s => s.Lng))
                .ForMember(d => d.FavoritedBy, o => o.Ignore());
        }
    }
}
