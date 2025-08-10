import { createContext } from "react";
import type { StoreApi } from "zustand/vanilla";
import type { PropertyState } from "./property.store";

export const PropertyStoreContext = createContext<StoreApi<PropertyState> | null>(null);
