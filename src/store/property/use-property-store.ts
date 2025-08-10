/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { http } from "@/services/api.service";
import type { PropertyDto, PropertyQuery } from "@/types/property";
import type { PagedResult } from "@/types/paged-result";

type State = PropertyQuery & {
  properties: PropertyDto[];
  totalCount: number;
  loading: boolean;
  error?: string;
  traceId?: string;
};

type Actions = {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (by: string, order: "asc" | "desc") => void;
  setFilter: (patch: Partial<PropertyQuery>) => void;
  clearFilters: () => void;
  fetchList: () => Promise<void>;
};

const initial: State = {
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
};

export const usePropertyStore = create<State & Actions>((set, get) => ({
  ...initial,

  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder, page: 1 }),
  setFilter: (patch) => set({ ...patch, page: 1 }),
  clearFilters: () => set(initial),

  fetchList: async () => {
    const s = get();
    set({ loading: true, error: undefined, traceId: undefined });
    try {
      const res = await http.get<PagedResult<PropertyDto>>("/property/list", {
        params: {
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
        },
      });
      set({
        properties: res.items ?? [],
        totalCount: res.totalCount ?? 0,
        page: res.page ?? s.page,
        pageSize: res.pageSize ?? s.pageSize,
      });
    } catch (e: any) {
      set({
        error: e?.message ?? "Failed to fetch properties",
        traceId: e?.traceId,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
