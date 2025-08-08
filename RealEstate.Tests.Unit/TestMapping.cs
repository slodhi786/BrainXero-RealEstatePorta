using AutoMapper;
using RealEstate.Application.Mapping;

namespace RealEstate.Tests.Unit
{
    public static class TestMapping
    {
        public static IMapper CreateMapper()
        {
            var cfg = new MapperConfiguration(c => c.AddProfile<MappingProfile>());
            cfg.AssertConfigurationIsValid();
            return cfg.CreateMapper();
        }
    }
}
