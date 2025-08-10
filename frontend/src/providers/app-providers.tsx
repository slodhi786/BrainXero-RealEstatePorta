import React from "react";
import { ServicesProvider } from "@/di/services.provider";
import { UserStoreProvider } from "@/store/user/user-store.provider";
import { PropertyStoreProvider } from "@/store/property/property-store.provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ServicesProvider>
      <UserStoreProvider>
        <PropertyStoreProvider>{children}</PropertyStoreProvider>
      </UserStoreProvider>
    </ServicesProvider>
  );
}
