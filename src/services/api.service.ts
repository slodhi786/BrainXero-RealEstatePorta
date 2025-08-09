/* src/services/api.service.ts */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/types/api-response";

// Base axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:7047/api",
  withCredentials: false,
});

export class ApiError<T = unknown> extends Error {
  statusCode: number;
  traceId?: string;
  payload?: T;
  constructor(
    message: string,
    statusCode: number,
    traceId?: string,
    payload?: T
  ) {
    super(message);
    this.statusCode = statusCode;
    this.traceId = traceId;
    this.payload = payload;
  }
}

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // ensure correct key!
  config.headers = config.headers ?? {};
  if (token) (config.headers as any).Authorization = `Bearer ${token}`;

  // console.log("[REQ] url:", (config.baseURL ?? "") + (config.url ?? ""));
  // console.log("[REQ] hasAuth?", !!(config.headers as any).Authorization);
  // console.log("[REQ] headers:", config.headers);

  return config;
});

// Response interceptor: unwrap ApiResponse<T>, or return raw data if not wrapped
api.interceptors.response.use(
  (resp) => {
    const body = resp.data as any;

    // Detect our ApiResponse<T> shape
    if (body && typeof (body as any).statusCode === "number") {
      const b = body as ApiResponse<any>;
      if (b.statusCode >= 200 && b.statusCode < 300) return b.data as any;
      throw new ApiError(
        b.message ?? "Request failed",
        b.statusCode,
        b.traceId,
        b
      );
    }

    // Non-wrapped endpoints: return raw data
    return resp.data as any;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    // Server responded with error and used ApiResponse<T>
    if (error.response?.data) {
      const b = error.response.data;
      throw new ApiError(
        b.message ?? "Request failed",
        b.statusCode ?? error.response.status ?? 0,
        b.traceId,
        b
      );
    }
    // Network / CORS / unknown
    throw new ApiError(error.message || "Network error", error.status ?? 0);
  }
);

// Data-centric facade: methods return payload T (not AxiosResponse<T>)
export type DataAxios = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

// Re-export the same axios instance but typed to return payloads
export const http = api as unknown as DataAxios;

// Optional helpers
export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}
