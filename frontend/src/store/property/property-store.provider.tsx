import { useMemo } from "react";
import { PropertyStoreContext } from "./property-store.context";
import { createPropertyStore } from "./property.store";
import { useServices } from "@/di/use-services";

export function PropertyStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const services = useServices();
  const store = useMemo(() => createPropertyStore(services), [services]);

  return (
    <PropertyStoreContext.Provider value={store}>
      {children}
    </PropertyStoreContext.Provider>
  );
}
