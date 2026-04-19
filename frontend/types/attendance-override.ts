export type OverrideType = "clock_in" | "clock_out" | "full_day";
export type OverrideStatus = "pending" | "approved" | "rejected";

export interface AttendanceOverride {
  id: number;
  attendance_log_id: number;
  attendance_date?: string; // joined
  requested_by: number;
  requester_name?: string; // joined
  approved_by: number | null;
  approver_name?: string; // joined
  override_type: OverrideType;
  original_clock_in: string | null;
  original_clock_out: string | null;
  corrected_clock_in: string | null;
  corrected_clock_out: string | null;
  reason: string;
  status: OverrideStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateOverridePayload {
  attendance_log_id: number;
  override_type: OverrideType;
  corrected_clock_in?: string | null;
  corrected_clock_out?: string | null;
  reason: string;
}

export interface UpdateOverrideStatusPayload {
  status: OverrideStatus;
  approver_notes?: string;
}

export interface OverrideListParams {
  employee_id?: number;
  status?: OverrideStatus;
}

export const OVERRIDE_TYPE_OPTIONS: {
  value: OverrideType;
  label: string;
}[] = [
  { value: "clock_in", label: "Koreksi Jam Masuk" },
  { value: "clock_out", label: "Koreksi Jam Keluar" },
  { value: "full_day", label: "Koreksi Penuh" },
];

export const OVERRIDE_STATUS_OPTIONS: {
  value: OverrideStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu", color: "yellow" },
  { value: "approved", label: "Disetujui", color: "green" },
  { value: "rejected", label: "Ditolak", color: "red" },
];
