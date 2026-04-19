import type {
  BusinessTripRequest,
  CreateBusinessTripPayload,
  UpdateBusinessTripStatusPayload,
  BusinessTripListParams,
} from "@/types/business-trip";
import { apiCall } from "@/lib/api";

/** Build query string from params */
function buildQueryString<T extends object>(params?: T): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// ════════════════════════════════════════════
// BUSINESS TRIP API
// ════════════════════════════════════════════

/** GET /business-trips — List business trip requests */
export async function fetchBusinessTrips(
  params?: BusinessTripListParams,
) {
  const query = buildQueryString(params);
  return apiCall<BusinessTripRequest[]>(`/business-trips${query}`);
}

/** GET /business-trips/:id — Get business trip by ID */
export async function fetchBusinessTripById(id: number) {
  return apiCall<BusinessTripRequest>(`/business-trips/${id}`);
}

/** POST /business-trips — Create a new business trip request */
export async function createBusinessTrip(
  payload: CreateBusinessTripPayload,
) {
  return apiCall<BusinessTripRequest>("/business-trips", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /business-trips/:id — Update business trip status (approve/reject) */
export async function updateBusinessTripStatus(
  id: number,
  payload: UpdateBusinessTripStatusPayload,
) {
  return apiCall<BusinessTripRequest>(`/business-trips/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /business-trips/:id — Delete a business trip request */
export async function deleteBusinessTrip(id: number) {
  return apiCall<null>(`/business-trips/${id}`, {
    method: "DELETE",
  });
}
