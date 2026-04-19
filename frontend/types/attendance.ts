export type AttendanceStatus =
  | "present"
  | "late"
  | "absent"
  | "half_day"
  | "leave"
  | "business_trip"
  | "holiday";

export type ClockMethod = "gps" | "qr_code" | "face_recognition" | "manual";

export interface AttendanceMetadata {
  status_meta: { id: string; name: string }[];
  clock_method_meta: { id: string; name: string }[];
  override_type_meta: { id: string; name: string }[];
  employee_meta: { id: string; name: string }[];
}

export interface AttendanceLog {
  id: number;
  employee_id: number;
  employee_name?: string; // joined
  employee_number?: string; // joined
  schedule_id: number | null;
  attendance_date: string; // "2026-04-06"
  clock_in_at: string | null;
  clock_out_at: string | null;
  clock_in_lat: number | null;
  clock_in_lng: number | null;
  clock_out_lat: number | null;
  clock_out_lng: number | null;
  clock_in_photo_url: string | null;
  clock_out_photo_url: string | null;
  clock_in_method: ClockMethod | null;
  clock_out_method: ClockMethod | null;
  status: AttendanceStatus;
  permission_request_id: number | null;
  leave_request_id: number | null;
  business_trip_request_id: number | null;
  is_counted_as_full_day: boolean;
  late_minutes: number;
  early_leave_minutes: number;
  late_notes: string | null;
  early_leave_notes: string | null;
  late_document_url: string | null;
  overtime_minutes: number;
  is_auto_generated: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AttendanceListParams {
  employee_id?: number;
  start_date?: string;
  end_date?: string;
  status?: AttendanceStatus;
  branch_id?: number;
}

export const ATTENDANCE_STATUS_OPTIONS: {
  value: AttendanceStatus;
  label: string;
  color: string;
}[] = [
  { value: "present", label: "Hadir", color: "green" },
  { value: "late", label: "Terlambat", color: "yellow" },
  { value: "absent", label: "Absen", color: "red" },
  { value: "half_day", label: "Setengah Hari", color: "orange" },
  { value: "leave", label: "Cuti", color: "blue" },
  { value: "business_trip", label: "Dinas Luar", color: "purple" },
  { value: "holiday", label: "Libur", color: "gray" },
];

export const CLOCK_METHOD_OPTIONS: {
  value: ClockMethod;
  label: string;
}[] = [
  { value: "gps", label: "GPS" },
  { value: "qr_code", label: "QR Code" },
  { value: "face_recognition", label: "Face Recognition" },
  { value: "manual", label: "Manual" },
];

// ══════════════════════════════════════════════════════════════════════════════
// Manual Attendance Payload (§4.6)
// ══════════════════════════════════════════════════════════════════════════════

export interface CreateManualAttendancePayload {
  employee_id: number;
  attendance_date: string; // "2026-04-06"
  clock_in_at: string; // ISO timestamp
  clock_out_at?: string | null; // opsional
  notes: string; // alasan presensi manual — wajib
}
