// ════════════════════════════════════════════
// HOLIDAY TYPES
// ════════════════════════════════════════════

import type { MetaItem } from "./meta";

export type HolidayType =
  | "national"
  | "joint"
  | "observance"
  | "company";

export const HOLIDAY_TYPE_LABELS: Record<HolidayType, string> = {
  national: "Nasional",
  joint: "Cuti Bersama",
  observance: "Peringatan",
  company: "Perusahaan",
};

export const HOLIDAY_TYPE_COLORS: Record<
  HolidayType,
  { bg: string; text: string }
> = {
  national: { bg: "bg-red-500/20", text: "text-red-500" },
  joint: { bg: "bg-orange-500/20", text: "text-orange-500" },
  observance: { bg: "bg-gray-500/20", text: "text-gray-500" },
  company: { bg: "bg-purple-500/20", text: "text-purple-500" },
};

export interface Holiday {
  id: number;
  name: string;
  year: number;
  date: string; // "2026-01-01"
  type: HolidayType;
  branch_id: number | null; // null = semua cabang
  branch_name?: string; // joined field
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateHolidayPayload {
  name: string;
  year: number;
  date: string;
  type: HolidayType;
  branch_id?: number | null;
  description?: string;
}

export interface UpdateHolidayPayload extends Partial<CreateHolidayPayload> {}

export interface HolidayListParams {
  year?: number;
  type?: HolidayType;
  branch_id?: number;
}

export interface HolidayMetadata {
  holiday_type_meta: MetaItem[];
  branch_meta: MetaItem[];
}
