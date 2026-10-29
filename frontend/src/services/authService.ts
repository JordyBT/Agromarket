import { apiRequest } from "@/services/api";

export type AuthUser = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  empresa: string;
  rol: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "Comprador" | "Proveedor";
  phone?: string | null;
  companyName?: string | null;
};

export type RegisterResponse = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

export function login(data: LoginRequest) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function register(data: RegisterRequest) {
  return apiRequest<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}