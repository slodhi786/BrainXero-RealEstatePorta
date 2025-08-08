/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import type { ApiResponse } from "@/types/api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5127/api",
  withCredentials: false,
});

// A typed error we can catch in UI
export class ApiError<T = unknown> extends Error {
  statusCode: number;
  traceId?: string;
  payload?: T;
  constructor(msg: string, statusCode: number, traceId?: string, payload?: T) {
    super(msg);
    this.statusCode = statusCode;
    this.traceId = traceId;
    this.payload = payload;
  }
}

// unwrap success and throw ApiError on fail (including 400 validation + 500 global middleware)
api.interceptors.response.use(
  (resp) => {
    const body = resp.data as ApiResponse<any>;
    // Successful 2xx with ApiResponse.Ok
    if (body?.statusCode >= 200 && body?.statusCode < 300) {
      return body.data;
    }
    // Rare case: server returned ApiResponse but not 2xx
    throw new ApiError(body?.message ?? "Request failed", body?.statusCode ?? resp.status, body?.traceId, body);
  },
  (error: AxiosError<ApiResponse<any>>) => {
    if (error.response?.data) {
      const body = error.response.data;
      throw new ApiError(
        body.message ?? "Request failed",
        body.statusCode ?? error.response.status,
        body.traceId,
        body
      );
    }
    throw new ApiError(error.message || "Network error", error.status ?? 0);
  }
);