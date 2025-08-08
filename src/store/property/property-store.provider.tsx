import { useMemo, type ReactNode } from "react";
import { PropertyStoreContext } from "./property-store.context";
import { createPropertyStore } from "./property.store";
import { useServices } from "@/di/use-services";

export function PropertyStoreProvider({ children }: { children: ReactNode }) {
  const { propertyService } = useServices();
  const store = useMemo(() => createPropertyStore({ propertyService }), [propertyService]); 
  return <PropertyStoreContext.Provider value={store}>{children}</PropertyStoreContext.Provider>;
}
