import { useContext } from "react";
import { useStore } from "zustand";
import type { PropertyStore } from "./property.store";
import { PropertyStoreContext } from "./property-store.context";

export function usePropertyStore<T>(selector: (s: PropertyStore) => T): T {
  const ctx = useContext(PropertyStoreContext);
  if (!ctx) throw new Error("usePropertyStore must be used within <PropertyStoreProvider>");
  return useStore(ctx, selector);
}
