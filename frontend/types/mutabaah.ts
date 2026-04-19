// ══════════════════════════════════════════════════════════════════════════════
// Mutaba'ah Types (§14 — Tilawah Al-Quran Harian)
// ══════════════════════════════════════════════════════════════════════════════

export interface MutabaahLog {
  id: number;
  employee_id: number;
  employee_name?: string;
  attendance_log_id: number;
  log_date: string;
  is_submitted: boolean;
  submitted_at: string | null;
  target_pages: number;
  is_auto_generated: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Derived status — dihitung dari is_submitted + tanggal, bukan enum di DB
export type MutabaahDisplayStatus = "submitted" | "not_submitted" | "missing";

export function deriveMutabaahStatus(
  log: MutabaahLog,
  currentDate: string,
): MutabaahDisplayStatus {
  if (log.is_submitted) return "submitted";
  if (log.log_date < currentDate) return "missing";
  return "not_submitted";
}

export interface MutabaahSubmitPayload {
  attendance_log_id: number;
}

export interface MutabaahCancelPayload {
  mutabaah_log_id: number;
}

export interface MutabaahListParams {
  employee_id?: number;
  department_id?: number;
  branch_id?: number;
  start_date?: string;
  end_date?: string;
  is_submitted?: boolean;
}

// Dashboard widget state (§14.5)
export interface MutabaahTodayStatus {
  has_record: boolean;
  is_submitted: boolean;
  submitted_at: string | null;
  target_pages: number;
  mutabaah_log_id?: number | null; // ID for cancellation
  attendance_log_id?: number | null; // ID for submission
}

// Report types (§14.6)
export interface MutabaahDailyReport {
  employee_id: number;
  employee_name: string;
  employee_number: string;
  department_name: string | null;
  is_trainer: boolean;
  target_pages: number;
  is_submitted: boolean;
  submitted_at: string | null;
}

export interface MutabaahMonthlySummary {
  employee_id: number;
  employee_name: string;
  is_trainer: boolean;
  total_working_days: number;
  total_submitted: number;
  compliance_percentage: number;
}

export interface MutabaahCategorySummary {
  category: "trainer" | "non_trainer";
  total_employees: number;
  total_submitted_today: number;
  total_not_submitted_today: number;
  average_compliance: number;
}

export const MUTABAAH_STATUS_OPTIONS: {
  value: MutabaahDisplayStatus;
  label: string;
  color: string;
}[] = [
  { value: "submitted", label: "Sudah Membaca", color: "green" },
  { value: "not_submitted", label: "Belum Membaca", color: "yellow" },
  { value: "missing", label: "Tidak Membaca", color: "red" },
];

export const MUTABAAH_TARGET = {
  NON_TRAINER: 5,
  TRAINER: 10,
} as const;
