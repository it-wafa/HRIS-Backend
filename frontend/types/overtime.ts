export type WorkLocationType = "office" | "home" | "outside";
export type OvertimeStatus = "pending" | "approved" | "rejected";

export interface OvertimeRequest {
  id: number;
  employee_id: number;
  employee_name?: string;
  attendance_log_id: number;
  overtime_date: string;
  planned_start: string | null;
  planned_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  planned_minutes: number;
  actual_minutes: number | null;
  reason: string;
  work_location_type: WorkLocationType;
  status: OvertimeStatus;
  approved_by: number | null;
  approver_name?: string;
  approver_notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateOvertimePayload {
  attendance_log_id: number;
  overtime_date: string;
  planned_start?: string;
  planned_end?: string;
  planned_minutes: number;
  reason: string;
  work_location_type: WorkLocationType;
}

export interface UpdateOvertimeStatusPayload {
  status: OvertimeStatus;
  approver_notes?: string;
}

export interface OvertimeListParams {
  employee_id?: number;
  status?: OvertimeStatus;
}

export const WORK_LOCATION_OPTIONS: {
  value: WorkLocationType;
  label: string;
}[] = [
  { value: "office", label: "Kantor" },
  { value: "home", label: "Rumah" },
  { value: "outside", label: "Luar Kantor" },
];

export const OVERTIME_STATUS_OPTIONS: {
  value: OvertimeStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu", color: "yellow" },
  { value: "approved", label: "Disetujui", color: "green" },
  { value: "rejected", label: "Ditolak", color: "red" },
];
