// src/services/property-service.ts
import { http } from "./api.service";
import type { PagedResult } from "@/types/paged-result";
import type { PropertyDto, PropertyQuery } from "@/types/property";

export interface IPropertyService {
  getList(params: PropertyQuery): Promise<PagedResult<PropertyDto>>;
  getById(id: string): Promise<PropertyDto>;
  create(dto: Partial<PropertyDto>): Promise<PropertyDto>;
  update(id: string, dto: Partial<PropertyDto>): Promise<PropertyDto>;
  remove(id: string): Promise<void>;
  addFavorite(propertyId: string): Promise<void>;
  removeFavorite(propertyId: string): Promise<boolean>;
  getMyFavorites(): Promise<PropertyDto[]>;
}

export class AxiosPropertyService implements IPropertyService {
  async getList(params: PropertyQuery) {
    return http.get<PagedResult<PropertyDto>>("/property/list", { params });
  }
  async getById(id: string) {
    return http.get<PropertyDto>(`/property/${id}`);
  }
  async create(dto: Partial<PropertyDto>) {
    return http.post<PropertyDto>("/property", dto);
  }
  async update(id: string, dto: Partial<PropertyDto>) {
    return http.put<PropertyDto>(`/property/${id}`, dto);
  }
  async remove(id: string) {
    await http.delete<void>(`/property/${id}`);
  }

  async addFavorite(propertyId: string): Promise<void> {
    await http.post<void>(`/favorites/add/${propertyId}`);
  }

  async removeFavorite(propertyId: string): Promise<boolean> {
    const removed = await http.delete<boolean>(
      `/favorites/remove/${propertyId}`
    );
    return !!removed;
  }

  async getMyFavorites(): Promise<PropertyDto[]> {
    return http.get<PropertyDto[]>(`/favorites`);
  }
}
