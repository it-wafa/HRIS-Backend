import type {
  Holiday,
  CreateHolidayPayload,
  UpdateHolidayPayload,
  HolidayListParams,
  HolidayMetadata,
} from "@/types/holiday";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// HOLIDAY METADATA
// ════════════════════════════════════════════

/** GET /holidays/metadata — Fetch holiday metadata */
export async function fetchHolidayMetadata() {
  return apiCall<HolidayMetadata>("/holidays/metadata");
}

// ════════════════════════════════════════════
// HOLIDAY API
// ════════════════════════════════════════════

/** GET /holidays — List all holidays */
export async function fetchHolidays(params?: HolidayListParams) {
  const searchParams = new URLSearchParams();
  if (params?.year !== undefined) {
    searchParams.append("year", String(params.year));
  }
  if (params?.type !== undefined) {
    searchParams.append("type", params.type);
  }
  if (params?.branch_id !== undefined) {
    searchParams.append("branch_id", String(params.branch_id));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/holidays?${query}` : "/holidays";

  return apiCall<Holiday[]>(endpoint);
}

/** GET /holidays/:id — Get holiday by ID */
export async function fetchHolidayById(id: number) {
  return apiCall<Holiday>(`/holidays/${id}`);
}

/** POST /holidays — Create a new holiday */
export async function createHoliday(
  payload: CreateHolidayPayload,
) {
  return apiCall<Holiday>("/holidays", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /holidays/:id — Update a holiday */
export async function updateHoliday(
  id: number,
  payload: UpdateHolidayPayload,
) {
  return apiCall<Holiday>(`/holidays/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /holidays/:id — Delete a holiday */
export async function deleteHoliday(id: number) {
  return apiCall<{ message: string }>(`/holidays/${id}`, {
    method: "DELETE",
  });
}
