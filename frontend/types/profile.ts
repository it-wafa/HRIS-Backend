// ── Profile Types ──

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfilePayload {
  full_name: string;
}

export interface UploadPhotoPayload {
  base64_image: string;
}

export interface UploadPhotoResponse {
  success: boolean;
  photo_url: string;
  message: string;
}

// ── Employee Profile Types (for Profile Page) ──

import type { Gender, MaritalStatus, ContactType } from "@/types/employee";

export interface EmployeeProfile {
  // Basic employee info
  id: number;
  employee_number: string;
  full_name: string;
  photo_url: string | null;

  // Personal data
  nik: string | null;
  npwp: string | null;
  kk_number: string | null;
  birth_date: string | null;
  birth_place: string | null;
  gender: Gender | null;
  religion: string | null;
  marital_status: MaritalStatus | null;
  blood_type: string | null;
  nationality: string | null;

  // Work info (joined from other tables)
  branch_id: number | null;
  department_id: number | null;
  role_id: number | null;
  job_positions_id: number | null;
  branch_name: string | null;
  department_name: string | null;
  role_name: string | null;
  job_position_title: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface EmployeeProfileContact {
  id: number;
  contact_type: ContactType;
  contact_value: string;
  contact_label: string | null;
  is_primary: boolean;
}
