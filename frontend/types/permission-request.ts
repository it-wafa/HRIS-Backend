export type PermissionType = "out_of_office" | "late_arrival" | "early_leave";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface PermissionRequest {
  id: number;
  employee_id: number;
  employee_name?: string;
  permission_type: PermissionType;
  date: string;
  leave_time: string | null; // HH:mm
  return_time: string | null;
  reason: string;
  document_url: string | null;
  status: RequestStatus;
  approved_by: number | null;
  approver_name?: string;
  approver_notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreatePermissionPayload {
  permission_type: PermissionType;
  date: string;
  leave_time?: string | null;
  return_time?: string | null;
  reason: string;
  document_url?: string;
}

export interface UpdatePermissionStatusPayload {
  status: RequestStatus;
  approver_notes?: string;
}

export interface PermissionListParams {
  employee_id?: number;
  status?: RequestStatus;
  permission_type?: PermissionType;
}

export const PERMISSION_TYPE_OPTIONS: {
  value: PermissionType;
  label: string;
}[] = [
  { value: "late_arrival", label: "Izin Terlambat" },
  { value: "early_leave", label: "Izin Pulang Cepat" },
  { value: "out_of_office", label: "Izin Keluar Kantor" },
];

export const PERMISSION_STATUS_OPTIONS: {
  value: RequestStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu", color: "yellow" },
  { value: "approved", label: "Disetujui", color: "green" },
  { value: "rejected", label: "Ditolak", color: "red" },
];
