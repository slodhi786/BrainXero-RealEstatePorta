import { useContext } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand/vanilla";
import { UserStoreContext } from "./user-store.context";
import type { UserState } from "./user.store";

export function useUserStore<T>(selector: (s: UserState) => T): T {
  const store = useContext(UserStoreContext) as StoreApi<UserState> | null;
  if (!store) throw new Error("useUserStore must be used within <UserStoreProvider>");
  return useStore(store, selector);
}