import { apiRequest } from "@/services/api";

export type ReservationStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Cancelled";

export type CreateReservationRequest = {
  publicationId: string;
  quantity: number;
};

export type Reservation = {
  id: string;
  publicationId: string;
  publicationTitle?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
  status: ReservationStatus;
  createdAt: string;
  resolvedAt?: string | null;
  seller?: {
    id: string;
    email: string;
  };
  buyer?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export function createReservation(
  data: CreateReservationRequest
) {
  return apiRequest<Reservation>("/api/reservations", {
    method: "POST",
    authenticated: true,
    body: JSON.stringify(data),
  });
}

export function getMyReservations() {
  return apiRequest<Reservation[]>(
    "/api/reservations/mine",
    {
      authenticated: true,
    }
  );
}

export function getReceivedReservations() {
  return apiRequest<Reservation[]>(
    "/api/reservations/received",
    {
      authenticated: true,
    }
  );
}

export function acceptReservation(id: string) {
  return apiRequest<Reservation>(
    `/api/reservations/${id}/accept`,
    {
      method: "PATCH",
      authenticated: true,
    }
  );
}

export function rejectReservation(id: string) {
  return apiRequest<Reservation>(
    `/api/reservations/${id}/reject`,
    {
      method: "PATCH",
      authenticated: true,
    }
  );
}

export function cancelReservation(id: string) {
  return apiRequest<Reservation>(
    `/api/reservations/${id}/cancel`,
    {
      method: "PATCH",
      authenticated: true,
    }
  );
}