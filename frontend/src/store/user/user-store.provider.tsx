import { useMemo, useEffect } from "react";
import { UserStoreContext } from "./user-store.context";
import { createUserStore } from "./user.store";
import { useServices } from "@/di/use-services";
import { useStore } from "zustand";

export function UserStoreProvider({ children }: { children: React.ReactNode }) {
  const services = useServices();
  const store = useMemo(() => createUserStore(services), [services]);

  // hydrate persisted token/user and set Authorization
  const hydrateFromStorage = useStore(store, (s) => s.hydrateFromStorage);
  useEffect(() => {
    hydrateFromStorage?.();
  }, [hydrateFromStorage]);

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
}