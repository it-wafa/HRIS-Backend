// ════════════════════════════════════════════
// DEPARTMENT TYPES
// ════════════════════════════════════════════

import type { MetaItem } from "./meta";

export interface Department {
  id: number;
  code: string;
  name: string;
  branch_id: number | null;
  branch_name?: string; // joined field untuk display
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateDepartmentPayload {
  code: string;
  name: string;
  branch_id?: number | null;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  branch_id?: number | null;
  description?: string;
  is_active?: boolean;
}

export interface DepartmentListParams {
  branch_id?: number;
  is_active?: boolean;
}

export interface DepartmentMetadata {
  branch_meta: MetaItem[];
}
