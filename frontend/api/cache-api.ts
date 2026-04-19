import { API_URL } from "./const";

interface ApiError {
  statusCode: number;
  message: string;
}

/**
 * Send DELETE to API cache refresh endpoint for a given service.
 * Includes credentials and optional Authorization header when token provided.
 */
export async function refreshCache(service: string, token?: string) {
  const url = `${API_URL}/cache/refresh?service=${encodeURIComponent(service)}`;

  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || (data && data.status === false)) {
    const err: ApiError = {
      statusCode: (data && data.statusCode) || res.status,
      message: (data && data.message) || "Failed to refresh cache",
    };
    throw err;
  }

  return data;
}
