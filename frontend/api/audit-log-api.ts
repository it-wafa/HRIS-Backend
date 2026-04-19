import type { AuditLog, AuditLogListParams } from "@/types/audit-log";
import { apiCall } from "@/lib/api";

// ══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

function buildQueryString<T extends object>(params?: T): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// ══════════════════════════════════════════════════════════════════════════════
// AUDIT LOG API
// ══════════════════════════════════════════════════════════════════════════════

/** GET /audit-logs — List audit logs with optional filters */
export async function fetchAuditLogs(
  params?: AuditLogListParams,
) {
  const query = buildQueryString(params);
  return apiCall<AuditLog[]>(`/audit-logs${query}`);
}

/** GET /audit-logs — Fetch audit logs for a specific record */
export async function fetchAuditLogsByRecord(
  tableName: string,
  recordId: number,
) {
  return fetchAuditLogs({ table_name: tableName, record_id: recordId });
}

/** GET /audit-logs/:id — Get audit log by ID */
export async function fetchAuditLogById(id: number) {
  return apiCall<AuditLog>(`/audit-logs/${id}`);
}
