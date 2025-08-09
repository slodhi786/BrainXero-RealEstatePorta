import { http } from "@/services/api.service";
import type { AuthResponse, RegisterDto, LoginDto } from "@/types/auth";

export interface IAuthService {
  register(dto: RegisterDto): Promise<AuthResponse>;
  login(dto: LoginDto): Promise<AuthResponse>;
}

export class AxiosAuthService implements IAuthService {
  register(dto: RegisterDto) {
    return http.post<AuthResponse>("/auth/register", dto);
  }
  login(dto: LoginDto) {
    return http.post<AuthResponse>("/auth/login", dto);
  }
}
