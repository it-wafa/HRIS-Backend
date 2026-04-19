import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type { AuditLogDisplay, AuditLogListParams } from "@/types/audit-log";
import { fetchAuditLogs } from "@/lib/audit-log-api";
import { getDummyAuditLogDisplay } from "@/lib/dummy";

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ══════════════════════════════════════════════════════════════════════════════
// HELPER: Transform AuditLog to AuditLogDisplay
// ══════════════════════════════════════════════════════════════════════════════

import type { AuditLog, AuditFieldChange } from "@/types/audit-log";

const TABLE_NAME_LABELS: Record<string, string> = {
  employees: "data pegawai",
  leave_approvals: "approval cuti",
  leave_requests: "pengajuan cuti",
  attendance_overrides: "koreksi presensi",
  contracts: "kontrak kerja",
  leave_types: "jenis cuti",
  attendance_logs: "log kehadiran",
  permission_requests: "pengajuan izin",
  overtime_requests: "pengajuan lembur",
  business_trip_requests: "pengajuan dinas luar",
};

const FIELD_LABELS: Record<string, string> = {
  job_positions_id: "ID Jabatan",
  job_position_title: "Jabatan",
  department_id: "ID Departemen",
  department_name: "Departemen",
  status: "Status",
  approved_by: "Disetujui Oleh",
  approved_at: "Waktu Persetujuan",
  notes: "Catatan",
  leave_request_id: "ID Pengajuan Cuti",
  approver_id: "ID Approver",
  level: "Level Approval",
  employee_id: "ID Pegawai",
  contract_type: "Tipe Kontrak",
  start_date: "Tanggal Mulai",
  end_date: "Tanggal Selesai",
  name: "Nama",
  category: "Kategori",
  requires_document: "Wajib Dokumen",
  requires_document_type: "Jenis Dokumen",
  max_duration_per_request: "Maks Durasi/Request",
  max_duration_unit: "Satuan Durasi",
  deleted_at: "Dihapus Pada",
};

function transformToDisplay(log: AuditLog): AuditLogDisplay {
  const changes: AuditFieldChange[] = [];

  // Collect all fields from old and new values
  const allFields = new Set([
    ...Object.keys(log.old_values || {}),
    ...Object.keys(log.new_values || {}),
  ]);

  allFields.forEach((field) => {
    const oldVal = log.old_values?.[field];
    const newVal = log.new_values?.[field];

    // Only add if there's a difference
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({
        field,
        label: FIELD_LABELS[field] || field,
        old_value: oldVal != null ? String(oldVal) : null,
        new_value: newVal != null ? String(newVal) : null,
      });
    }
  });

  const tableLabel = TABLE_NAME_LABELS[log.table_name] || log.table_name;

  return {
    id: log.id,
    actor_name: log.employee_name || "System",
    target_description: `${tableLabel} #${log.record_id}`,
    action: log.action,
    changes,
    created_at: log.created_at,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// useAuditLogList — Contextual Audit Log (§12)
// ══════════════════════════════════════════════════════════════════════════════

export function useAuditLogList(params?: AuditLogListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<AuditLogDisplay[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyAuditLogDisplay(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchAuditLogs(paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          // Transform to display format
          const displayData = res.data.map(transformToDisplay);
          setState({ data: displayData, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat audit log";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Refetch when params change
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params?.table_name,
    params?.record_id,
    params?.employee_id,
    params?.action,
  ]);

  return { ...state, refetch };
}
