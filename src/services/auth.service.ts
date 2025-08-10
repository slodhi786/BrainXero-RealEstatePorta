import { http } from "@/services/api.service";
import type { ApiResponse } from "@/types/api-response";
import type { AuthResponse, RegisterDto, LoginDto } from "@/types/auth";

export interface IAuthService {
  register(dto: Partial<RegisterDto>): Promise<ApiResponse<AuthResponse>>;
  login(dto: Partial<LoginDto>): Promise<ApiResponse<AuthResponse>>;
}

export class AxiosAuthService implements IAuthService {
  async register(dto: Partial<RegisterDto>) {
    return http.post<ApiResponse<AuthResponse>>("/auth/register", dto);
  }
  async login(dto: Partial<LoginDto>) {
    return http.post<ApiResponse<AuthResponse>>("/auth/login", dto);
  }
}
