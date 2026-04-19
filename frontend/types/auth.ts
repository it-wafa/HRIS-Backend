// ============================================
// Auth Flow Types (matching backend models)
// ============================================

export interface LoginAccount {
  account_id: number;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
  employee_number: string;
  full_name: string;
  photo_url: string | null;
  is_trainer: boolean;
  branch_id: number | null;
  department_id: number | null;
  job_positions_id: number | null;
  role_name: string;
}

export interface LoginResponse {
  token: string;
  refresh: string;
  permissions: string[];
  account: LoginAccount;
}

export type AuthStep = "login";
