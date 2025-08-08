import type { ValidationErrors } from "./validation-errors";

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  errors?: ValidationErrors;
  traceId?: string;
};