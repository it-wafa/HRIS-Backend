// ════════════════════════════════════════════
// SHIFT & SCHEDULE TYPES
// ════════════════════════════════════════════

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const DAY_OF_WEEK_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Senin" },
  { value: "tuesday", label: "Selasa" },
  { value: "wednesday", label: "Rabu" },
  { value: "thursday", label: "Kamis" },
  { value: "friday", label: "Jum'at" },
  { value: "saturday", label: "Sabtu" },
  { value: "sunday", label: "Minggu" },
];

export interface ShiftTemplateDetail {
  id: number;
  shift_template_id: number;
  day_of_week: DayOfWeek;
  is_working_day: boolean;
  clock_in_start: string | null; // "07:30" format HH:mm, null jika libur
  clock_in_end: string | null;
  break_dhuhr_start: string | null; // Opsional — boleh kosong
  break_dhuhr_end: string | null; // Opsional — boleh kosong
  break_asr_start: string | null; // Opsional — boleh kosong
  break_asr_end: string | null; // Opsional — boleh kosong
  clock_out_start: string | null;
  clock_out_end: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ShiftTemplate {
  id: number;
  name: string;
  is_flexible: boolean;
  details: ShiftTemplateDetail[]; // child records per hari
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateShiftDetailPayload {
  day_of_week: DayOfWeek;
  is_working_day: boolean;
  clock_in_start?: string | null;
  clock_in_end?: string | null;
  break_dhuhr_start?: string | null; // opsional
  break_dhuhr_end?: string | null; // opsional
  break_asr_start?: string | null; // opsional
  break_asr_end?: string | null; // opsional
  clock_out_start?: string | null;
  clock_out_end?: string | null;
}

export interface CreateShiftPayload {
  name: string;
  is_flexible?: boolean;
  details: CreateShiftDetailPayload[]; // 7 entries (Sen–Min)
}

export interface UpdateShiftPayload {
  name?: string;
  is_flexible?: boolean;
  details?: CreateShiftDetailPayload[]; // partial update
}

export interface EmployeeSchedule {
  id: number;
  employee_id: number;
  employee_name?: string; // joined field
  employee_number?: string; // joined field
  shift_template_id: number;
  shift_name?: string; // joined field
  effective_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateSchedulePayload {
  employee_id: number;
  shift_template_id: number;
  effective_date: string;
  end_date?: string | null;
}

export interface UpdateSchedulePayload extends Partial<CreateSchedulePayload> {
  is_active?: boolean;
}

export interface ScheduleListParams {
  employee_id?: number;
  shift_template_id?: number;
  is_active?: boolean;
}

// ════════════════════════════════════════════
// SHIFT METADATA
// ════════════════════════════════════════════

import type { MetaItem } from "./meta";

export interface ShiftMetadata {
  day_of_week_meta: MetaItem[];
}
