/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from "zustand/vanilla";
import type { StoreApi } from "zustand/vanilla";
import type { PropertyDto, PropertyQuery } from "@/types/property";
import type { PagedResult } from "@/types/api";
import type { Services } from "@/di/property/services.context";
import { ApiError } from "@/services/api.service"; // if you created this typed error

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
  selected?: PropertyDto | null;
};

type Actions = {
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (by: string, order: "asc" | "desc") => void;
  resetList: () => void;

  fetchList: (extra?: Partial<PropertyQuery>) => Promise<void>;
  fetchById: (id: string) => Promise<void>;

  create: (dto: Partial<PropertyDto>) => Promise<PropertyDto | undefined>;
  update: (
    id: string,
    dto: Partial<PropertyDto>
  ) => Promise<PropertyDto | undefined>;
  remove: (id: string) => Promise<boolean>;
  toggleFavorite: (propertyId: string, currentUserId: string) => Promise<void>;
  clearSelected: () => void;
};

export type PropertyStore = State & Actions;

export function createPropertyStore(
  services: Services
): StoreApi<PropertyStore> {
  return createStore<PropertyStore>((set, get) => ({
    properties: [],
    totalCount: 0,
    page: 1,
    pageSize: 5,
    sortBy: "bedrooms",
    sortOrder: "desc",
    loading: false,
    selected: null,

    setPage: (page) => set({ page }),
    setPageSize: (pageSize) => set({ pageSize }),
    setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder, page: 1 }),
    resetList: () =>
      set({
        properties: [],
        totalCount: 0,
        page: 1,
        error: undefined,
        traceId: undefined,
      }),

    fetchList: async (extra) => {
      const { page, pageSize, sortBy, sortOrder } = get();
      set({ loading: true, error: undefined, traceId: undefined });
      try {
        const res = await services.propertyService.getList({
          page,
          pageSize,
          sortBy,
          sortOrder,
          ...(extra ?? {}),
        });
        const { items, totalCount } = res as PagedResult<PropertyDto>;
        set({ properties: items, totalCount, loading: false });
      } catch (e: any) {
        const err = e as ApiError;
        set({
          loading: false,
          error: err?.message ?? "Failed to load",
          traceId: (err as any)?.traceId,
        });
      }
    },

    fetchById: async (id: string) => {
      set({
        loading: true,
        error: undefined,
        traceId: undefined,
        selected: null,
      });
      try {
        const item = await services.propertyService.getById(id);
        set({ selected: item, loading: false });
      } catch (e: any) {
        const err = e as ApiError;
        set({
          loading: false,
          error: err?.message ?? "Failed to load",
          traceId: (err as any)?.traceId,
        });
      }
    },

    create: async (dto) => {
      set({ error: undefined, traceId: undefined });
      try {
        const created = await services.propertyService.create(dto);
        // optimistic prepend
        set((s) => ({
          properties: [created, ...s.properties],
          totalCount: s.totalCount + 1,
        }));
        return created;
      } catch (e: any) {
        const err = e as ApiError;
        set({
          error: err?.message ?? "Failed to create",
          traceId: (err as any)?.traceId,
        });
      }
    },

    update: async (id, dto) => {
      set({ error: undefined, traceId: undefined });
      try {
        const updated = await services.propertyService.update(id, dto);
        set((s) => ({
          properties: s.properties.map((p) => (p.id === id ? updated : p)),
          selected: s.selected?.id === id ? updated : s.selected ?? null,
        }));
        return updated;
      } catch (e: any) {
        const err = e as ApiError;
        set({
          error: err?.message ?? "Failed to update",
          traceId: (err as any)?.traceId,
        });
      }
    },

    remove: async (id) => {
      set({ error: undefined, traceId: undefined });
      const prev = get().properties;
      // optimistic remove
      set((s) => ({
        properties: s.properties.filter((p) => p.id !== id),
        totalCount: Math.max(0, s.totalCount - 1),
      }));
      try {
        await services.propertyService.remove(id);
        return true;
      } catch (e: any) {
        // rollback
        set({ properties: prev });
        const err = e as ApiError;
        set({
          error: err?.message ?? "Failed to delete",
          traceId: (err as any)?.traceId,
        });
        return false;
      }
    },

    toggleFavorite: async (propertyId: any, currentUserId: any) => {
      const s = get();
      const prevList = s.properties;
      const prevSelected = s.selected;
      const isDetail = prevSelected?.id === propertyId;

      // Is it currently favorited by this user?
      const hasFavOnList = prevList.some(
        (p) =>
          p.id === propertyId &&
          p.favoritedBy?.some(
            (f: { userId: any }) => f.userId === currentUserId
          )
      );
      const hasFavOnSelected =
        isDetail &&
        prevSelected?.favoritedBy?.some(
          (f: { userId: any }) => f.userId === currentUserId
        );
      const willFavorite = !(hasFavOnList || hasFavOnSelected);

      const apply = (p: PropertyDto): PropertyDto => {
        const has = p.favoritedBy?.some(
          (f: { userId: any }) => f.userId === currentUserId
        );
        if (willFavorite && !has) {
          return {
            ...p,
            favoritedBy: [
              ...(p.favoritedBy ?? []),
              { userId: currentUserId, propertyId: p.id } as any,
            ],
          };
        }
        if (!willFavorite && has) {
          return {
            ...p,
            favoritedBy: (p.favoritedBy ?? []).filter(
              (f: { userId: any }) => f.userId !== currentUserId
            ),
          };
        }
        return p;
      };

      // optimistic update
      set({
        properties: prevList.map((p) => (p.id === propertyId ? apply(p) : p)),
        selected:
          isDetail && prevSelected ? apply(prevSelected) : s.selected ?? null,
        error: undefined,
        traceId: undefined,
      });

      try {
        if (willFavorite) {
          await services.propertyService.addFavorite(propertyId);
        } else {
          const ok = await services.propertyService.removeFavorite(propertyId);
          if (!ok) throw new Error("Could not remove favorite");
        }
      } catch (e: any) {
        // rollback
        set({ properties: prevList, selected: prevSelected });
        set({
          error: e?.message ?? "Failed to update favorite",
          traceId: (e as any)?.traceId,
        });
      }
    },

    clearSelected: () => set({ selected: null }),
  }));
}
