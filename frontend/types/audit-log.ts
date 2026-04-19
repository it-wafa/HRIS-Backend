// ══════════════════════════════════════════════════════════════════════════════
// Audit Log Types (preparation for §12)
// ══════════════════════════════════════════════════════════════════════════════

export type AuditAction = "create" | "update" | "delete";

export interface AuditLog {
  id: number;
  employee_id: number | null;
  employee_name?: string; // joined
  table_name: string;
  record_id: number;
  action: AuditAction;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditLogListParams {
  table_name?: string;
  record_id?: number;
  employee_id?: number;
  action?: AuditAction;
  start_date?: string;
  end_date?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// Diff Format for Contextual Display (§12 — format tampilan)
// ══════════════════════════════════════════════════════════════════════════════

export interface AuditFieldChange {
  field: string;
  label: string; // human-readable field name
  old_value: string | null;
  new_value: string | null;
}

export interface AuditLogDisplay {
  id: number;
  actor_name: string; // siapa yang melakukan
  target_description: string; // "data pegawai Usman Hakim"
  action: AuditAction;
  changes: AuditFieldChange[];
  created_at: string;
}
