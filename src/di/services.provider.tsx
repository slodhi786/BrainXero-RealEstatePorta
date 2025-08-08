import { useMemo, type ReactNode } from "react";
import { AxiosPropertyService } from "@/services/properties.service";
import { ServicesContext, type Services } from "./services.context";

export function ServicesProvider({ children }: { children: ReactNode }) {
  const services = useMemo<Services>(() => ({
    propertyService: new AxiosPropertyService(),
  }), []);

  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
