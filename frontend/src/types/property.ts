import type { FavoriteDto } from "./favorite";
import type { ListingType } from "./listing-type";

export type PropertyDto = {
  id: string;
  title: string;
  address?: string;
  location?: string;
  city?: string;
  price: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  carSpots?: number | null;
  sizeLabel?: string; 
  areaLabel?: string;
  status?: "For Sale" | "For Rent" | string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  listingType: ListingType;
  favoritedBy: FavoriteDto[];
  isFavorite?: boolean;
  lat?: number | null;
  lng?: number | null;
  propertyType?: "All" | "House" | "Apartment" | "Plot" | string;
};

export type PropertyQuery = {
  q?: string;
  city?: string;
  type?: "All" | "House" | "Apartment" | "Plot" | "";
  minPrice?: number | null;
  maxPrice?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
};
