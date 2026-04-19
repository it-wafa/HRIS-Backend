// ════════════════════════════════════════════
// EMPLOYEE TYPES
// ════════════════════════════════════════════

import type { MetaItem } from "./meta";

export type Gender = "male" | "female" | "other";
export type MaritalStatus = "single" | "married" | "widowed" | "divorced";
export type ContactType = "phone" | "email" | "address";

export interface Employee {
  id: number;
  employee_number: string;
  full_name: string;
  nik: string | null;
  npwp: string | null;
  kk_number: string | null;
  birth_date: string;
  birth_place: string | null;
  gender: Gender;
  religion: string | null;
  marital_status: MaritalStatus | null;
  blood_type: string | null;
  nationality: string | null;

  photo_url: string | null;
  is_active: boolean;
  is_trainer: boolean;
  branch_id: number | null;
  department_id: number | null;
  role_id: number | null;
  job_positions_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined fields for display
  branch_name?: string;
  department_name?: string;
  role_name?: string;
  job_position_title?: string;
}

export interface EmployeeContact {
  id: number;
  employee_id: number;
  contact_type: ContactType;
  contact_value: string;
  contact_label: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateEmployeePayload {
  employee_number: string;
  full_name: string;
  nik?: string;
  npwp?: string;
  kk_number?: string;
  birth_date: string;
  birth_place?: string;
  gender: Gender;
  religion?: string;
  marital_status?: MaritalStatus;
  blood_type?: string;
  nationality?: string;

  photo_url?: string;
  is_active?: boolean;
  is_trainer?: boolean;
  branch_id?: number;
  department_id?: number;
  role_id?: number;
  job_positions_id?: number;
}

export interface CreateEmployeeResponse {
  credentials: {
    email: string;
    password: string;
  };
  employee: Employee;
}

export interface UpdateEmployeePayload {
  employee_number?: string;
  full_name?: string;
  nik?: string;
  npwp?: string;
  kk_number?: string;
  birth_date?: string;
  birth_place?: string;
  gender?: Gender;
  religion?: string;
  marital_status?: MaritalStatus;
  blood_type?: string;
  nationality?: string;

  photo_url?: string;
  is_active?: boolean;
  is_trainer?: boolean;
  branch_id?: number;
  department_id?: number;
  role_id?: number;
  job_positions_id?: number;
}

export interface CreateContactPayload {
  contact_type: ContactType;
  contact_value: string;
  contact_label?: string;
  is_primary?: boolean;
}

export interface UpdateContactPayload {
  contact_type?: ContactType;
  contact_value?: string;
  contact_label?: string;
  is_primary?: boolean;
}

export interface EmployeeListParams {
  branch_id?: number;
  department_id?: number;
  is_active?: boolean;
  search?: string;
}

export interface EmployeeMetadata {
  branch_meta: MetaItem[];
  department_meta: MetaItem[];
  role_meta: MetaItem[];
  job_position_meta: MetaItem[];
  gender_meta: MetaItem[];
  religion_meta: MetaItem[];
  marital_status_meta: MetaItem[];
  blood_type_meta: MetaItem[];
  status_meta: MetaItem[];
}

// Contact type labels for display
export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  phone: "Telepon",
  email: "Email",
  address: "Alamat",
};
