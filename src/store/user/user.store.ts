/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, type StoreApi } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { setAuthToken } from "@/services/api.service";
import type { Services } from "@/di/services.context";
import type { RegisterDto, LoginDto } from "@/types/auth";

export type UserInfo = { id: string; userName: string; email: string };

export type UserState = {
  user?: UserInfo;
  token?: string;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
  traceId?: string;

  register: (dto: RegisterDto) => Promise<void>;
  login: (dto: LoginDto) => Promise<void>;
  logout: () => void;
  hydrateFromStorage: () => void;
};

export function createUserStore(services: Services): StoreApi<UserState> {
  return createStore<UserState>()(
    persist(
      (set, get) => ({
        user: undefined,
        token: undefined,
        isAuthenticated: false,
        loading: false,

        register: async (dto) => {
          set({ loading: true, error: undefined, traceId: undefined });
          try {
            const res = await services.authService.register(dto);
            setAuthToken(res.token);
            localStorage.setItem("access_token", res.token);
            set({
              user: {
                id: res.userId,
                userName: res.userName,
                email: res.email,
              },
              token: res.token,
              isAuthenticated: true,
              loading: false,
            });
          } catch (e: any) {
            set({
              loading: false,
              error: e?.message ?? "Registration failed",
              traceId: (e as any)?.traceId,
            });
          }
        },

        login: async (dto) => {
          set({ loading: true, error: undefined, traceId: undefined });
          try {
            const res = await services.authService.login(dto);
            setAuthToken(res.token);
            localStorage.setItem("access_token", res.token);
            set({
              user: {
                id: res.userId,
                userName: res.userName,
                email: res.email,
              },
              token: res.token,
              isAuthenticated: true,
              loading: false,
            });
          } catch (e: any) {
            set({
              loading: false,
              error: e?.message ?? "Sign-in failed",
              traceId: (e as any)?.traceId,
            });
          }
        },

        logout: () => {
          setAuthToken(undefined);
          localStorage.removeItem("access_token");
          set({
            user: undefined,
            token: undefined,
            isAuthenticated: false,
            error: undefined,
            traceId: undefined,
          });
        },

        hydrateFromStorage: () => {
          const token = localStorage.getItem("access_token") || get().token;
          if (token) {
            setAuthToken(token);
            set({ token, isAuthenticated: !!get().user }); // user is persisted below
          }
        },
      }),
      {
        name: "auth-state",
        partialize: (s) => ({
          token: s.token,
          user: s.user,
          isAuthenticated: s.isAuthenticated,
        }),
        version: 1,
      }
    )
  );
}
