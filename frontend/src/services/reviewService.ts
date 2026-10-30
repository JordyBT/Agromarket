import { apiRequest } from "@/services/api";

export type Review = {
  id: string;
  reservationId: string;
  buyerId: string;
  providerId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
};

export type ReservationReview = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
};

export type ReservationReviewStatus = {
  reservationId: string;
  canReview: boolean;
  hasReview: boolean;
  review: ReservationReview | null;
};

export type ProviderReview = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;

  buyer: {
    id: string;
    firstName: string;
    lastName: string;
  };

  publication: {
    id: string;
    title: string;
  };
};

export type ProviderReputation = {
  providerId: string;
  averageRating: number;
  totalReviews: number;
  reviews: ProviderReview[];
};

export type CreateReviewRequest = {
  reservationId: string;
  rating: number;
  comment?: string;
};

export function createReview(
  data: CreateReviewRequest
) {
  return apiRequest<Review>(
    "/api/reviews",
    {
      method: "POST",
      authenticated: true,
      body: JSON.stringify(data),
    }
  );
}

export function getReviewByReservation(
  reservationId: string
) {
  return apiRequest<ReservationReviewStatus>(
    `/api/reviews/reservation/${reservationId}`,
    {
      authenticated: true,
    }
  );
}

export function getProviderReviews(
  providerId: string
) {
  return apiRequest<ProviderReputation>(
    `/api/reviews/provider/${providerId}`
  );
}