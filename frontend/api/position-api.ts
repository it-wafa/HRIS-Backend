import type {
  JobPosition,
  CreatePositionPayload,
  UpdatePositionPayload,
} from "@/types/job-position";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// POSITION API
// ════════════════════════════════════════════

/** GET /positions — List all job positions */
export async function fetchPositions(departmentId?: number) {
  const searchParams = new URLSearchParams();
  if (departmentId !== undefined) {
    searchParams.append("department_id", String(departmentId));
  }
  const query = searchParams.toString();
  const endpoint = query ? `/positions?${query}` : "/positions";
  return apiCall<JobPosition[]>(endpoint);
}

/** POST /positions — Create a new job position */
export async function createPosition(
  payload: CreatePositionPayload,
) {
  return apiCall<JobPosition>("/positions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /positions/:id — Update a job position */
export async function updatePosition(
  id: number,
  payload: UpdatePositionPayload,
) {
  return apiCall<JobPosition>(`/positions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /positions/:id — Delete a job position */
export async function deletePosition(id: number) {
  return apiCall<{ message: string }>(`/positions/${id}`, {
    method: "DELETE",
  });
}
