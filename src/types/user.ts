import type { FavoriteDto } from "./favorite";

export type UserDto = {
  id: string; // Guid
  userName: string;
  email?: string;
  favorites?: FavoriteDto[];
};