import { apiRequest } from "@/services/api";

export type Profile = {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  companyName?: string | null;
  address?: string | null;
  isVerified: boolean;
  role: string;
};

export type UpdateProfileRequest = {
  firstName: string;
  lastName: string;
  phone?: string | null;
  companyName?: string | null;
  address?: string | null;
};

export function getMyProfile() {
  return apiRequest<Profile>("/api/profile/me", {
    authenticated: true,
  });
}

export function updateMyProfile(
  data: UpdateProfileRequest
) {
  return apiRequest<Profile>("/api/profile/me", {
    method: "PUT",
    authenticated: true,
    body: JSON.stringify(data),
  });
}