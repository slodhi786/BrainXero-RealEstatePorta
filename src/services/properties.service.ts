import { api } from "./api.service";
import type { PagedResult } from "@/types/api";
import type { PropertyDto, PropertyQuery } from "@/types/property";

export interface IPropertyService {
  getList(params: PropertyQuery): Promise<PagedResult<PropertyDto>>;
  getById(id: string): Promise<PropertyDto>;
  create(dto: Partial<PropertyDto>): Promise<PropertyDto>;
  update(id: string, dto: Partial<PropertyDto>): Promise<PropertyDto>;
  remove(id: string): Promise<void>;
}

export class AxiosPropertyService implements IPropertyService {
  async getList(params: PropertyQuery): Promise<PagedResult<PropertyDto>> {
    // if your api instance returns AxiosResponse, do: (await api.get(...)).data
    return api.get<PagedResult<PropertyDto>>("/property/list", { params });
  }

  async getById(id: string): Promise<PropertyDto> {
    return api.get<PropertyDto>(`/property/${id}`);
  }

  async create(dto: Partial<PropertyDto>): Promise<PropertyDto> {
    return api.post<PropertyDto>("/property", dto);
  }

  async update(id: string, dto: Partial<PropertyDto>): Promise<PropertyDto> {
    return api.put<PropertyDto>(`/property/${id}`, dto);
  }

  async remove(id: string): Promise<void> {
    await api.delete<void>(`/property/${id}`); // <-- await, no return
  }
}
