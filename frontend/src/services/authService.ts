import { apiRequest } from "@/services/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  nombre: string;
  apellido: string;
  empresa: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  empresa: string;
  rol: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export async function login(
  data: LoginRequest
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}