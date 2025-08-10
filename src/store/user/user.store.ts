import { createStore, type StoreApi } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { setAuthToken } from "@/services/api.service";
import type { Services } from "@/di/services.context";
import type { RegisterDto, LoginDto } from "@/types/auth";
import type { UserDto } from "@/types/user";
import { isOk } from "@/utils/api";

export type UserInfo = UserDto;

export type UserState = {
  user?: UserInfo;
  token?: string;
  isAuthenticated: boolean;
  loading: boolean;
  error?: boolean;
  message?: string;
  traceId?: string;

  register: (dto: RegisterDto) => Promise<boolean>;
  login: (dto: LoginDto) => Promise<boolean>;
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
          set({ loading: true, message: undefined });
          try {
            const res = await services.authService.register(dto);
            const { statusCode, message } = res;
            if (!isOk(statusCode)) {
              set({
                loading: false,
                message: message,
                isAuthenticated: false,
                token: undefined,
                error: true,
              });
              setAuthToken(undefined);
              localStorage.removeItem("access_token");
              return false;
            }
            set({
              loading: false,
              message: message,
              isAuthenticated: false,
              token: undefined,
              user: undefined,
              error: false,
            });
            setAuthToken(undefined);
            localStorage.removeItem("access_token");
            return true;
          } catch (e) {
            set({
              loading: false,
              message: "Registration failed | " + e,
              isAuthenticated: false,
              token: undefined,
              error: true,
            });
            setAuthToken(undefined);
            localStorage.removeItem("access_token");
            return false;
          }
        },

        login: async (dto) => {
          set({ loading: true, message: undefined });
          try {
            const res = await services.authService.login(dto);
            const { statusCode, message, data } = res;

            if (!isOk(statusCode) || !data?.token) {
              set({
                loading: false,
                message: message || "Sign-in failed",
                isAuthenticated: false,
                token: undefined,
              });
              setAuthToken(undefined);
              localStorage.removeItem("access_token");
              return false;
            }

            setAuthToken(data.token);
            localStorage.setItem("access_token", data.token);

            set({
              user: {
                id: data.userId,
                userName: data.userName,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
              },
              token: data.token,
              isAuthenticated: true,
              loading: false,
              message: undefined,
            });

            return true;
          } catch (e) {
            set({
              loading: false,
              message: "Sign-in failed | " + e,
              isAuthenticated: false,
              token: undefined,
            });
            setAuthToken(undefined);
            localStorage.removeItem("access_token");
            return false;
          }
        },

        logout: () => {
          setAuthToken(undefined);
          localStorage.removeItem("access_token");
          set({
            user: undefined,
            token: undefined,
            isAuthenticated: false,
            message: undefined,
            traceId: undefined,
          });
        },

        hydrateFromStorage: () => {
          const token = localStorage.getItem("access_token") || get().token;
          if (token) {
            setAuthToken(token);
            // isAuthenticated true only if we have both token and user
            set({ token, isAuthenticated: !!get().user });
          } else {
            setAuthToken(undefined);
            set({ token: undefined, isAuthenticated: false });
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
