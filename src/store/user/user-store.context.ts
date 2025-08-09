import { createContext } from "react";
import type { StoreApi } from "zustand/vanilla";
import type { UserState } from "./user.store";

export const UserStoreContext = createContext<StoreApi<UserState> | null>(null);
