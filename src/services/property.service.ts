// src/services/property-service.ts
import type { ApiResponse } from "@/types/api-response";
import { http } from "./api.service";
import type { PagedResult } from "@/types/paged-result";
import type { PropertyDto, PropertyQuery } from "@/types/property";

export interface IPropertyService {
  getList(
    params: PropertyQuery
  ): Promise<ApiResponse<PagedResult<PropertyDto>>>;
  getById(id: string): Promise<ApiResponse<PropertyDto>>;
  create(dto: Partial<PropertyDto>): Promise<PropertyDto>;
  update(id: string, dto: Partial<PropertyDto>): Promise<PropertyDto>;
  remove(id: string): Promise<void>;
  addFavorite(propertyId: string): Promise<ApiResponse<boolean>>;
  removeFavorite(propertyId: string): Promise<ApiResponse<boolean>>;
  getFavorites(): Promise<ApiResponse<PropertyDto[]>>;
}

export class AxiosPropertyService implements IPropertyService {
  async getList(params: PropertyQuery) {
    return http.get<ApiResponse<PagedResult<PropertyDto>>>("/property/list", {
      params,
    });
  }
  async getById(id: string) {
    return http.get<ApiResponse<PropertyDto>>(`/property/${id}`);
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

  async addFavorite(propertyId: string): Promise<ApiResponse<boolean>> {
    return await http.post<ApiResponse<boolean>>(`/favorites/add/${propertyId}`);
  }

  async removeFavorite(propertyId: string): Promise<ApiResponse<boolean>> {
    return await http.delete<ApiResponse<boolean>>(
      `/favorites/remove/${propertyId}`
    );
  }

  async getFavorites(): Promise<ApiResponse<PropertyDto[]>> {
    return http.get<ApiResponse<PropertyDto[]>>(`/favorites`);
  }
}
