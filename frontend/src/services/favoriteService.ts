import { apiRequest } from "@/services/api";
import type { Publication } from "@/services/publicationService";

export type Favorite = {
  id: string;
  publicationId: string;
  createdAt: string;
  publication: Publication;
};

export type FavoriteCheckResponse = {
  publicationId: string;
  isFavorite: boolean;
};

export type AddFavoriteResponse = {
  id?: string;
  publicationId: string;
  createdAt?: string;
  isFavorite: boolean;
};

export function getFavorites() {
  return apiRequest<Favorite[]>(
    "/api/favorites",
    {
      authenticated: true,
    }
  );
}

export function checkFavorite(
  publicationId: string
) {
  return apiRequest<FavoriteCheckResponse>(
    `/api/favorites/${publicationId}/check`,
    {
      authenticated: true,
    }
  );
}

export function addFavorite(
  publicationId: string
) {
  return apiRequest<AddFavoriteResponse>(
    `/api/favorites/${publicationId}`,
    {
      method: "POST",
      authenticated: true,
    }
  );
}

export function removeFavorite(
  publicationId: string
) {
  return apiRequest<void>(
    `/api/favorites/${publicationId}`,
    {
      method: "DELETE",
      authenticated: true,
    }
  );
}