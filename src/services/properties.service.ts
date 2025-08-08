import { api } from "./api.service";
import type { PagedResult } from "@/types/api";
import type { PropertyDto, PropertyQuery } from "@/types/property";

export async function getProperties(q: PropertyQuery) {
  // backend expects { page, pageSize, ...filters } as querystring
  return api.get<PagedResult<PropertyDto>>("/property/list", { params: q });
}

export async function getProperty(id: number) {
  return api.get<PropertyDto>(`/property/${id}`);
}

export async function createProperty(dto: Partial<PropertyDto>) {
  return api.post<PropertyDto>("/property", dto);
}

export async function updateProperty(id: number, dto: Partial<PropertyDto>) {
  return api.put<PropertyDto>(`/property/${id}`, dto);
}

export async function deleteProperty(id: number) {
  return api.delete<void>(`/property/${id}`);
}
