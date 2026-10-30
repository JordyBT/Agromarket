import { getToken } from "@/services/sessionService";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type ApiRequestOptions = RequestInit & {
  token?: string | null;
  authenticated?: boolean;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    token,
    authenticated = false,
    headers,
    body,
    ...requestOptions
  } = options;

  const authToken =
    token ?? (authenticated ? getToken() : null);

  const isFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...requestOptions,
      body,
      headers: {
        ...(isFormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),
        ...(authToken
          ? {
              Authorization:
                `Bearer ${authToken}`,
            }
          : {}),
        ...headers,
      },
    }
  );

  if (!response.ok) {
    let message =
      "Ocurrió un error al comunicarse con el servidor.";

    try {
      const errorData =
        await response.json();

      if (
        typeof errorData?.message ===
          "string" &&
        errorData.message.trim()
      ) {
        message =
          errorData.message;
      }
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}