import type { FavoriteDto } from "./favorite";

export type UserDto = {
  id: string; // Guid
  firstName?: string;
  lastName?: string;
  userName: string;
  email?: string;
  favorites?: FavoriteDto[];
};