import { createContext } from "react";
import type { IPropertyService } from "@/services/property.service";
import type { IAuthService } from "@/services/auth.service";

export type Services = {
  propertyService: IPropertyService;
  authService: IAuthService;
};

export const ServicesContext = createContext<Services | null>(null);