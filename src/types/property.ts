import type { FavoriteDto } from "./favorite";
import type { ListingType } from "./listing-type";

export type PropertyDto = {
  id: string;
  title: string;
  address: string;
  price: number;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  carSpots: number;
  description: string;
  imageUrls: string[];
  favoritedBy: FavoriteDto[];
};

export type PropertyQuery = {
  page: number;
  pageSize: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
};
