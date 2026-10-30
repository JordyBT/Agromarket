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

export type UpdatePublicationRequest =
  CreatePublicationRequest;

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
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  seller?: {
    id: string;
    email: string;
  };
};

export type UpdatePublicationStatusResponse = {
  id: string;
  isActive: boolean;
  stock: number;
};

export type UploadPublicationImageResponse = {
  id: string;
  imageUrl: string;
};

export function createPublication(
  data: CreatePublicationRequest
) {
  return apiRequest<Publication>(
    "/api/publications",
    {
      method: "POST",
      authenticated: true,
      body: JSON.stringify(data),
    }
  );
}

export function getPublications() {
  return apiRequest<Publication[]>(
    "/api/publications"
  );
}

export function getMyPublications() {
  return apiRequest<Publication[]>(
    "/api/publications/mine",
    {
      authenticated: true,
    }
  );
}

export function getMyPublicationById(
  id: string
) {
  return apiRequest<Publication>(
    `/api/publications/mine/${id}`,
    {
      authenticated: true,
    }
  );
}

export function getPublicationById(
  id: string
) {
  return apiRequest<Publication>(
    `/api/publications/${id}`
  );
}

export function updatePublication(
  id: string,
  data: UpdatePublicationRequest
) {
  return apiRequest<Publication>(
    `/api/publications/${id}`,
    {
      method: "PUT",
      authenticated: true,
      body: JSON.stringify(data),
    }
  );
}

export function updatePublicationStatus(
  id: string,
  isActive: boolean
) {
  return apiRequest<UpdatePublicationStatusResponse>(
    `/api/publications/${id}/status/${isActive}`,
    {
      method: "PATCH",
      authenticated: true,
    }
  );
}

export function uploadPublicationImage(
  id: string,
  image: File
) {
  const formData = new FormData();

  formData.append("image", image);

  return apiRequest<UploadPublicationImageResponse>(
    `/api/publications/${id}/image`,
    {
      method: "POST",
      authenticated: true,
      body: formData,
    }
  );
}

export function deletePublicationImage(
  id: string
) {
  return apiRequest<void>(
    `/api/publications/${id}/image`,
    {
      method: "DELETE",
      authenticated: true,
    }
  );
}