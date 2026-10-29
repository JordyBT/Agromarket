import { apiRequest } from "@/services/api";

export type CreatePublicationRequest = {
  title: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  minimumOrder: number;
  department: string;
  municipality: string;
};

export type Publication = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  category: string;
  minimumOrder: number;
  department: string;
  municipality: string;
  isActive: boolean;
  createdAt: string;
};

export async function createPublication(
  data: CreatePublicationRequest
): Promise<Publication> {
  return apiRequest<Publication>("/api/publications", {
    method: "POST",
    authenticated: true,
    body: JSON.stringify(data),
  });
}