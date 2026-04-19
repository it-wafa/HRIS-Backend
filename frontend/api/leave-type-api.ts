import type {
  LeaveType,
  CreateLeaveTypePayload,
  UpdateLeaveTypePayload,
  LeaveTypeMetadata,
} from "@/types/leave";
import { apiCall } from "@/lib/api";

// ══════════════════════════════════════════════════════════════════════════════
// LEAVE TYPE CRUD API (§1.5)
// ══════════════════════════════════════════════════════════════════════════════

/** GET /leave-types/metadata — Fetch leave type metadata */
export async function fetchLeaveTypeMetadata() {
  return apiCall<LeaveTypeMetadata>("/leave-types/metadata");
}

/** GET /leave-types — List all leave types */
export async function fetchLeaveTypes() {
  return apiCall<LeaveType[]>("/leave-types");
}

/** GET /leave-types/:id — Get leave type by ID */
export async function fetchLeaveTypeById(id: number) {
  return apiCall<LeaveType>(`/leave-types/${id}`);
}

/** POST /leave-types — Create new leave type */
export async function createLeaveType(
  payload: CreateLeaveTypePayload,
) {
  return apiCall<LeaveType>("/leave-types", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /leave-types/:id — Update leave type */
export async function updateLeaveType(
  id: number,
  payload: UpdateLeaveTypePayload,
) {
  return apiCall<LeaveType>(`/leave-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /leave-types/:id — Delete leave type (soft delete) */
export async function deleteLeaveType(id: number) {
  return apiCall<{ message: string }>(`/leave-types/${id}`, {
    method: "DELETE",
  });
}
