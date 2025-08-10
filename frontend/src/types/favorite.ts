import type { PropertyDto } from "./property";
import type { UserDto } from "./user";

export type FavoriteDto = {
  userId: string; // Guid
  user: UserDto;            
  propertyId: string; // Guid
  property: PropertyDto;
};