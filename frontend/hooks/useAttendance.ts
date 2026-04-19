import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type { AttendanceLog, AttendanceListParams } from "@/types/attendance";
import type {
  AttendanceOverride,
  CreateOverridePayload,
  UpdateOverrideStatusPayload,
  OverrideListParams,
} from "@/types/attendance-override";
import {
  fetchAttendanceLogs,
  fetchAttendanceOverrides,
  createAttendanceOverride as createOverrideApi,
  updateOverrideStatus as updateOverrideStatusApi,
} from "@/lib/attendance-api";
import {
  getDummyAttendanceLogs,
  getDummyAttendanceOverrides,
} from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useAttendanceList — Fetch attendance logs
// ════════════════════════════════════════════

export function useAttendanceList(params?: AttendanceListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<AttendanceLog[]>>({
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
        data: getDummyAttendanceLogs(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchAttendanceLogs(paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat data kehadiran";
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
    params?.employee_id,
    params?.start_date,
    params?.end_date,
    params?.status,
    params?.branch_id,
  ]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useOverrideList — Fetch attendance overrides
// ════════════════════════════════════════════

export function useOverrideList(params?: OverrideListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<AttendanceOverride[]>>({
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
        data: getDummyAttendanceOverrides(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchAttendanceOverrides(paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat data koreksi";
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
  }, [params?.employee_id, params?.status]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useOverrideMutations — CRUD operations for overrides
// ════════════════════════════════════════════

export function useOverrideMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createOverride = useCallback(
    async (payload: CreateOverridePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createOverrideApi(payload);
        toast.success("Pengajuan koreksi berhasil dikirim");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal mengajukan koreksi";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const approveOverride = useCallback(
    async (id: number, notes?: string) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      const payload: UpdateOverrideStatusPayload = {
        status: "approved",
        approver_notes: notes,
      };

      setLoading(true);
      try {
        const res = await updateOverrideStatusApi(id, payload);
        toast.success("Koreksi disetujui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menyetujui koreksi";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const rejectOverride = useCallback(
    async (id: number, notes?: string) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      const payload: UpdateOverrideStatusPayload = {
        status: "rejected",
        approver_notes: notes,
      };

      setLoading(true);
      try {
        const res = await updateOverrideStatusApi(id, payload);
        toast.success("Koreksi ditolak");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menolak koreksi";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createOverride, approveOverride, rejectOverride };
}

// ════════════════════════════════════════════════════════════════════════════════
// useManualAttendanceMutations — Create Manual Attendance (§4.6)
// ════════════════════════════════════════════════════════════════════════════════

import type { CreateManualAttendancePayload } from "@/types/attendance";
import { createManualAttendance as createManualAttendanceApi } from "@/lib/attendance-api";

export function useManualAttendanceMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createManualAttendance = useCallback(
    async (payload: CreateManualAttendancePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createManualAttendanceApi(payload);
        toast.success("Presensi manual berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal menambahkan presensi manual";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createManualAttendance };
}
