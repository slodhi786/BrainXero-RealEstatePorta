import { createContext } from "react";
import type { IPropertyService } from "@/services/property.service";

export type Services = {
  propertyService: IPropertyService;
};

export const ServicesContext = createContext<Services | null>(null);