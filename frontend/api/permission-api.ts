import type {
  PermissionRequest,
  CreatePermissionPayload,
  UpdatePermissionStatusPayload,
  PermissionListParams,
} from "@/types/permission-request";
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
// PERMISSION REQUEST API
// ════════════════════════════════════════════

/** GET /permission-requests — List permission requests */
export async function fetchPermissionRequests(
  params?: PermissionListParams,
) {
  const query = buildQueryString(params);
  return apiCall<PermissionRequest[]>(`/permission-requests${query}`);
}

/** GET /permission-requests/:id — Get permission request by ID */
export async function fetchPermissionRequestById(id: number) {
  return apiCall<PermissionRequest>(`/permission-requests/${id}`);
}

/** POST /permission-requests — Create a new permission request */
export async function createPermissionRequest(
  payload: CreatePermissionPayload,
) {
  return apiCall<PermissionRequest>("/permission-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /permission-requests/:id — Update permission status (approve/reject) */
export async function updatePermissionStatus(
  id: number,
  payload: UpdatePermissionStatusPayload,
) {
  return apiCall<PermissionRequest>(`/permission-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /permission-requests/:id — Delete a permission request */
export async function deletePermissionRequest(id: number) {
  return apiCall<null>(`/permission-requests/${id}`, {
    method: "DELETE",
  });
}
