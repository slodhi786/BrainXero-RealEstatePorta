import { useContext } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand/vanilla";
import { PropertyStoreContext } from "./property-store.context";
import type { PropertyState } from "./property.store";

export function usePropertyStore<T>(selector: (s: PropertyState) => T): T {
  const store = useContext(PropertyStoreContext) as StoreApi<PropertyState> | null;
  if (!store) throw new Error("usePropertyStore must be used within <PropertyStoreProvider>");
  return useStore(store, selector);
}
