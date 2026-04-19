import type { AttendanceLog, AttendanceListParams } from "@/types/attendance";
import type {
  AttendanceOverride,
  CreateOverridePayload,
  UpdateOverrideStatusPayload,
  OverrideListParams,
} from "@/types/attendance-override";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// ATTENDANCE LOG API
// ════════════════════════════════════════════

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

/** GET /attendance — List attendance logs */
export async function fetchAttendanceLogs(
  params?: AttendanceListParams,
) {
  const query = buildQueryString(params);
  return apiCall<AttendanceLog[]>(`/attendance${query}`);
}

/** GET /attendance/metadata — Get attendance metadata */
export async function fetchAttendanceMetadata() {
  return apiCall<import("@/types/attendance").AttendanceMetadata>(`/attendance/metadata`);
}

/** GET /attendance/:id — Get attendance log by ID */
export async function fetchAttendanceLogById(id: number) {
  return apiCall<AttendanceLog>(`/attendance/${id}`);
}

// ════════════════════════════════════════════
// ATTENDANCE OVERRIDE API
// ════════════════════════════════════════════

/** GET /attendance-overrides — List attendance overrides */
export async function fetchAttendanceOverrides(
  params?: OverrideListParams,
) {
  const query = buildQueryString(params);
  return apiCall<AttendanceOverride[]>(`/attendance-overrides${query}`);
}

/** GET /attendance-overrides/:id — Get override by ID */
export async function fetchAttendanceOverrideById(id: number) {
  return apiCall<AttendanceOverride>(`/attendance-overrides/${id}`);
}

/** POST /attendance-overrides — Create attendance override request */
export async function createAttendanceOverride(
  payload: CreateOverridePayload,
) {
  return apiCall<AttendanceOverride>("/attendance-overrides", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /attendance-overrides/:id — Update override status (approve/reject) */
export async function updateOverrideStatus(
  id: number,
  payload: UpdateOverrideStatusPayload,
) {
  return apiCall<AttendanceOverride>(`/attendance-overrides/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ════════════════════════════════════════════
// MANUAL ATTENDANCE API (§4.6)
// ════════════════════════════════════════════

import type { CreateManualAttendancePayload } from "@/types/attendance";

/** POST /attendance/manual — Create manual attendance entry */
export async function createManualAttendance(
  payload: CreateManualAttendancePayload,
) {
  return apiCall<AttendanceLog>("/attendance/manual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
