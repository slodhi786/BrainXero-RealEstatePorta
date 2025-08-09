import { useMemo, type ReactNode } from "react";
import { AxiosAuthService } from "@/services/auth.service";
import { AxiosPropertyService } from "@/services/property.service";
import { ServicesContext, type Services } from "./services.context";

export function ServicesProvider({ children }: { children: ReactNode }) {
  const services = useMemo<Services>(
    () => ({
      authService: new AxiosAuthService(),
      propertyService: new AxiosPropertyService(),
    }),
    []
  );

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}
