export type LeaveCategory = "annual" | "sick" | "special" | "other";
export type DurationUnit = "days" | "hours";
export type LeaveRequestStatus =
  | "pending"
  | "approved_leader"
  | "approved_hr"
  | "rejected";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface LeaveType {
  id: number;
  name: string;
  category: LeaveCategory;
  requires_document: boolean;
  requires_document_type: string | null;
  max_duration_per_request: number | null;
  max_duration_unit: DurationUnit | null;
  max_occurrences_per_year: number | null;
  max_total_duration_per_year: number | null;
  max_total_duration_unit: DurationUnit | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface LeaveBalance {
  id: number;
  employee_id: number;
  employee_name?: string; // joined
  leave_type_id: number;
  leave_type_name?: string; // joined
  year: number;
  used_occurrences: number;
  used_duration: number;
  max_occurrences?: number | null; // computed from leave_type
  max_duration?: number | null;
  remaining_occurrences?: number | null;
  remaining_duration?: number | null;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name?: string;
  leave_type_id: number;
  leave_type_name?: string;
  leave_category?: LeaveCategory;
  start_date: string;
  end_date: string;
  total_days: number;
  total_hours: number | null;
  reason: string | null;
  document_url: string | null;
  status: LeaveRequestStatus;
  approvals?: LeaveApproval[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface LeaveApproval {
  id: number;
  leave_request_id: number;
  approver_id: number;
  approver_name?: string;
  level: number; // 1 = Leader Dept, 2 = Leader HRGA
  status: ApprovalStatus;
  notes: string | null;
  decided_at: string | null;
  created_at: string;
}

export interface CreateLeavePayload {
  leave_type_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  total_hours?: number | null;
  reason?: string;
  document_url?: string;
}

export interface ApproveLeavePayload {
  notes?: string;
}

export interface RejectLeavePayload {
  notes: string;
}

export interface LeaveListParams {
  employee_id?: number;
  status?: LeaveRequestStatus;
  leave_type_id?: number;
  year?: number;
}

export interface LeaveBalanceListParams {
  employee_id?: number;
  year?: number;
}

export const LEAVE_CATEGORY_OPTIONS: { value: LeaveCategory; label: string }[] =
  [
    { value: "annual", label: "Cuti Tahunan" },
    { value: "sick", label: "Sakit" },
    { value: "special", label: "Cuti Khusus" },
    { value: "other", label: "Lainnya" },
  ];

export const LEAVE_STATUS_OPTIONS: {
  value: LeaveRequestStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu", color: "yellow" },
  { value: "approved_leader", label: "Disetujui Leader", color: "blue" },
  { value: "approved_hr", label: "Disetujui HR", color: "green" },
  { value: "rejected", label: "Ditolak", color: "red" },
];

export const APPROVAL_STATUS_OPTIONS: {
  value: ApprovalStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu", color: "yellow" },
  { value: "approved", label: "Disetujui", color: "green" },
  { value: "rejected", label: "Ditolak", color: "red" },
];

// ══════════════════════════════════════════════════════════════════════════════
// Leave Type CRUD Payloads (§1.5)
// ══════════════════════════════════════════════════════════════════════════════

export interface CreateLeaveTypePayload {
  name: string;
  category: LeaveCategory;
  requires_document: boolean;
  requires_document_type?: string | null;
  max_duration_per_request?: number | null;
  max_duration_unit?: DurationUnit | null;
  max_occurrences_per_year?: number | null;
  max_total_duration_per_year?: number | null;
  max_total_duration_unit?: DurationUnit | null;
}

export interface UpdateLeaveTypePayload extends Partial<CreateLeaveTypePayload> {}

// ══════════════════════════════════════════════════════════════════════════════
// Leave Type Metadata
// ══════════════════════════════════════════════════════════════════════════════

import type { MetaItem } from "./meta";

export interface LeaveTypeMetadata {
  category_meta: MetaItem[];
  duration_unit_meta: MetaItem[];
}
