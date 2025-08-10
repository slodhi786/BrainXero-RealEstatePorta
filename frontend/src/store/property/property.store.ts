/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, type StoreApi } from "zustand/vanilla";
import type { Services } from "@/di/services.context";
import type { PropertyDto, PropertyQuery } from "@/types/property";
import type { PagedResult } from "@/types/paged-result";
import type { ApiResponse } from "@/types/api-response";
import { isOk } from "@/utils/api";

export type PropertyState = PropertyQuery & {
  properties: PropertyDto[];
  totalCount: number;
  loading: boolean;
  message?: string;
  traceId?: string;
  error?: string;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (by: string, order: "asc" | "desc") => void;
  setFilter: (patch: Partial<PropertyQuery>) => void;
  clearFilters: () => void;

  fetchList: () => Promise<void>;
  getPropertyById: (id: string) => Promise<PropertyDto | null>;
  getFavorites: () => Promise<void>;
  toggleFavorite: (id: string, current: boolean) => Promise<boolean>;
};

const initial: PropertyState = {
  q: "",
  city: "",
  type: "",
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  bathrooms: null,
  sortBy: "price",
  sortOrder: "desc",
  page: 1,
  pageSize: 9,
  properties: [],
  totalCount: 0,
  loading: false,
  error: undefined,
  message: undefined,
  traceId: undefined,

  setPage: () => {},
  setPageSize: () => {},
  setSort: () => {},
  setFilter: () => {},
  clearFilters: () => {},

  fetchList: async () => {},
  getPropertyById: async () => null,
  getFavorites: async () => {},
  toggleFavorite: async () => false,
};

export function createPropertyStore(
  services: Services
): StoreApi<PropertyState> {
  const { propertyService } = services;

  return createStore<PropertyState>()((set, get) => ({
    ...initial,

    setPage: (page) => set({ page }),
    setPageSize: (pageSize) => set({ pageSize, page: 1 }),
    setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder, page: 1 }),
    setFilter: (patch) => set({ ...patch, page: 1 }),
    clearFilters: () =>
      set({
        ...initial,
        properties: [],
        totalCount: 0,
      }),

    fetchList: async () => {
      const s = get();
      set({ loading: true, message: undefined, traceId: undefined });
      try {
        const res: ApiResponse<PagedResult<PropertyDto>> =
          await propertyService.getList({
            q: s.q || undefined,
            city: s.city || undefined,
            type: s.type || undefined,
            minPrice: s.minPrice ?? undefined,
            maxPrice: s.maxPrice ?? undefined,
            bedrooms: s.bedrooms ?? undefined,
            bathrooms: s.bathrooms ?? undefined,
            sortBy: s.sortBy,
            sortOrder: s.sortOrder,
            page: s.page,
            pageSize: s.pageSize,
          });

        const { statusCode, message, data, traceId } = res;
        if (!isOk(statusCode) || !data) {
          set({ message: message || "Failed to fetch properties", traceId });
          return;
        }

        set({
          properties: data.items ?? [],
          totalCount: data.totalCount ?? 0,
          page: data.page ?? s.page,
          pageSize: data.pageSize ?? s.pageSize,
        });
      } catch (e: any) {
        set({
          message:
            e?.response?.data?.message ??
            e?.message ??
            "Failed to fetch properties",
          traceId: e?.response?.data?.traceId ?? e?.traceId,
        });
      } finally {
        set({ loading: false });
      }
    },

    getFavorites: async () => {
      set({ loading: true, message: undefined, traceId: undefined });
      try {
        const res = await propertyService.getFavorites();

        const { statusCode, message, data, traceId } = res;
        if (!isOk(statusCode) || !data) {
          set({ message: message || "Failed to fetch properties", traceId });
        }

        set({
          properties: data,
        });
      } catch (e: any) {
        set({
          message:
            e?.response?.data?.message ??
            e?.message ??
            "Failed to fetch properties",
          traceId: e?.response?.data?.traceId ?? e?.traceId,
        });
      } finally {
        set({ loading: false });
      }
    },

    getPropertyById: async (id: string) => {
      set({ loading: true, message: undefined, traceId: undefined });
      try {
        const res = await propertyService.getById(id);
        const { statusCode, message, data, traceId } = res;
        if (!isOk(statusCode) || !data) {
          set({ message: message || "Failed to fetch property", traceId });
          return null;
        }
        return data;
      } catch (e: any) {
        set({
          message:
            e?.response?.data?.message ??
            e?.message ??
            "Failed to fetch property",
          traceId: e?.response?.data?.traceId ?? e?.traceId,
        });
        return null;
      } finally {
        set({ loading: false });
      }
    },

    toggleFavorite: async (id, current) => {
      const next = !current;
      const prev = get().properties;

      // optimistic update in list
      set({
        properties: prev.map((p) =>
          p.id === id ? { ...p, isFavorite: next } : p
        ),
      });

      try {
        if (next) {
          const res = await propertyService.addFavorite(id);
          if (!isOk(res.statusCode)) {
            set({
              properties: prev.map((p) =>
                p.id === id ? { ...p, isFavorite: current } : p
              ),
              message: res.message || "Failed to add favorite",
              traceId: res.traceId,
            });
            return current;
          }
          return next;
        } else {
          const res = await propertyService.removeFavorite(id);
          if (!isOk(res.statusCode) || res.data !== true) {
            set({
              properties: prev.map((p) =>
                p.id === id ? { ...p, isFavorite: current } : p
              ),
              message: res.message || "Failed to remove favorite",
              traceId: res.traceId,
            });
            return current;
          }
          return next;
        }
      } catch (e: any) {
        set({
          properties: prev.map((p) =>
            p.id === id ? { ...p, isFavorite: current } : p
          ),
          message:
            e?.response?.data?.message ??
            e?.message ??
            "Failed to update favorite",
          traceId: e?.response?.data?.traceId ?? e?.traceId,
        });
        return current;
      }
    },
  }));
}
