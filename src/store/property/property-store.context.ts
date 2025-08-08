import { createContext } from "react";
import type { StoreApi } from "zustand/vanilla";
import type { PropertyStore } from "./property.store";

export const PropertyStoreContext = createContext<StoreApi<PropertyStore> | null>(null);
