import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProperties } from "@/services/properties.service";
import type { PropertyDto } from "@/types/property";
import type { PagedResult } from "@/types/api";
import { ApiError } from "@/services/api.service";

type State = {
  properties: PropertyDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  loading: boolean;
  error?: string;
  traceId?: string;

  setProperties: (items: PropertyDto[]) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (by: string, order: "asc" | "desc") => void;
  fetchList: () => Promise<void>;
};

export const usePropertyStore = create<State>()(
  persist(
    (set, get) => ({
      properties: [],
      totalCount: 0,
      page: 1,
      pageSize: 5,
      sortBy: "bedrooms",
      sortOrder: "desc",
      loading: false,

      setProperties: (items) => set({ properties: items }),
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ pageSize }),
      setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder, page: 1 }),

      fetchList: async () => {
        const { page, pageSize, sortBy, sortOrder } = get();
        set({ loading: true, error: undefined, traceId: undefined });
        try {
          const res = await getProperties({ page, pageSize, sortBy, sortOrder });
          const { items, totalCount } = res as PagedResult<PropertyDto>;
          set({ properties: items, totalCount, loading: false });
        } catch (e) {
          const err = e as ApiError;
          set({ loading: false, error: err.message, traceId: err.traceId });
        }
      },
    }),
    {
      name: "property-preferences", // key in localStorage
      partialize: (state) => ({
        // only persist these
        pageSize: state.pageSize,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
      version: 1,
    }
  )
);
