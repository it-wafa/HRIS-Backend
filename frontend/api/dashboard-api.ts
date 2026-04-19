import type {
  EmployeeDashboardData,
  HRDDashboardData,
  ClockInPayload,
  ClockOutPayload,
} from "@/types/dashboard";
import type { AttendanceLog } from "@/types/attendance";
import { apiCall } from "@/lib/api";
// DASHBOARD API
// ══════════════════════════════════════════════════════════════════════════════

/** GET /dashboard/employee — Employee dashboard data */
export async function fetchEmployeeDashboard() {
  return apiCall<EmployeeDashboardData>("/dashboard/employee");
}

/** GET /dashboard/hrd — HRD/Supervisor dashboard data */
export async function fetchHRDDashboard() {
  return apiCall<HRDDashboardData>("/dashboard/hrd");
}

// ══════════════════════════════════════════════════════════════════════════════
// PRESIGNED URL
// ══════════════════════════════════════════════════════════════════════════════

export interface PresignResponse {
  upload_url: string;
  object_key: string;
  expires_in: number;
}

/** POST /attendance/presign — Get presigned URL for clock photo upload */
export async function presignClockPhoto(action: "clock_in" | "clock_out") {
  return apiCall<PresignResponse>("/attendance/presign", {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

/** Upload photo to presigned MinIO URL */
export async function uploadPhotoToPresigned(uploadUrl: string, file: File) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "image/jpeg",
    },
  });
  if (!response.ok) throw new Error("Gagal mengupload foto");
}

// ══════════════════════════════════════════════════════════════════════════════
// CLOCK IN / CLOCK OUT API
// ══════════════════════════════════════════════════════════════════════════════

/** POST /attendance/clock-in — Clock in for today */
export async function clockIn(payload: ClockInPayload) {
  return apiCall<AttendanceLog>("/attendance/clock-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /attendance/clock-out — Clock out for today */
export async function clockOut(payload: ClockOutPayload) {
  return apiCall<AttendanceLog>("/attendance/clock-out", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
