import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  DailyReport,
  CreateDailyReportPayload,
  UpdateDailyReportPayload,
  DailyReportListParams,
} from "@/types/daily-report";
import {
  fetchDailyReports,
  createDailyReport as createReportApi,
  updateDailyReport as updateReportApi,
} from "@/lib/daily-report-api";
import { getDummyDailyReports } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useDailyReportList — Fetch daily reports
// ════════════════════════════════════════════

export function useDailyReportList(params?: DailyReportListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<DailyReport[]>>({
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
        data: getDummyDailyReports(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchDailyReports(paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat laporan harian";
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
    params?.is_submitted,
  ]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useDailyReportMutations — CRUD operations
// ════════════════════════════════════════════

export function useDailyReportMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createReport = useCallback(
    async (payload: CreateDailyReportPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createReportApi(payload);
        toast.success("Laporan harian berhasil dikirim");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal mengirim laporan";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const updateReport = useCallback(
    async (id: number, payload: UpdateDailyReportPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await updateReportApi(id, payload);
        toast.success("Laporan harian berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui laporan";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createReport, updateReport };
}
