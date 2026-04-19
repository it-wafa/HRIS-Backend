// ══════════════════════════════════════════════════════════════════════════════
// Daily Report Types (§10 — RKH, refactored for v3)
// ══════════════════════════════════════════════════════════════════════════════

// Derived status — dihitung dari is_submitted + tanggal, bukan enum di DB
export type DailyReportDisplayStatus =
  | "submitted"
  | "not_submitted"
  | "missing";

export function deriveDailyReportStatus(
  report: DailyReport,
  currentDate: string,
): DailyReportDisplayStatus {
  if (report.is_submitted) return "submitted";
  if (report.report_date < currentDate) return "missing";
  return "not_submitted";
}

export interface DailyReport {
  id: number;
  employee_id: number;
  employee_name?: string;
  attendance_log_id: number | null;
  report_date: string;
  activities: string | null;
  is_submitted: boolean;
  submitted_at: string | null;
  is_auto_generated: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateDailyReportPayload {
  report_date: string;
  activities: string;
  attendance_log_id?: number;
}

export interface UpdateDailyReportPayload {
  activities?: string;
}

export interface DailyReportListParams {
  employee_id?: number;
  start_date?: string;
  end_date?: string;
  is_submitted?: boolean;
}

export const REPORT_STATUS_OPTIONS: {
  value: DailyReportDisplayStatus;
  label: string;
  color: string;
}[] = [
  { value: "submitted", label: "Sudah Diisi", color: "green" },
  { value: "not_submitted", label: "Belum Diisi", color: "yellow" },
  { value: "missing", label: "Terlewat", color: "red" },
];
