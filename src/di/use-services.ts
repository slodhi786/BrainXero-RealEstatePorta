import { useContext } from "react";
import { ServicesContext } from "./services.context";

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used within <ServicesProvider>");
  return ctx;
}
