import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  MutabaahLog,
  MutabaahListParams,
  MutabaahTodayStatus,
  MutabaahDailyReport,
  MutabaahMonthlySummary,
  MutabaahCategorySummary,
} from "@/types/mutabaah";
import {
  fetchMutabaahLogs,
  fetchMutabaahToday,
  submitMutabaah as submitMutabaahApi,
  cancelMutabaah as cancelMutabaahApi,
  fetchMutabaahDailyReport,
  fetchMutabaahMonthlyReport,
  fetchMutabaahCategoryReport,
} from "@/lib/mutabaah-api";
import {
  getDummyMutabaahLogs,
  getDummyMutabaahTodayStatus,
  getDummyMutabaahDailyReport,
  getDummyMutabaahMonthlySummary,
  getDummyMutabaahCategorySummary,
} from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useMutabaahList — Fetch mutabaah logs
// ════════════════════════════════════════════

export function useMutabaahList(params?: MutabaahListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<MutabaahLog[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const refetch = useCallback(() => {
    if (isDemo) {
      setState({
        data: getDummyMutabaahLogs(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchMutabaahLogs(paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error
              ? err.message
              : "Gagal memuat data Mutaba'ah";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
// useMutabaahActions — Submit / Cancel tilawah
// ════════════════════════════════════════════

export function useMutabaahActions(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [todayStatus, setTodayStatus] = useState<AsyncState<MutabaahTodayStatus>>({
    data: null,
    loading: true,
    error: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRef = useRef(0);

  const refetchToday = useCallback(() => {
    if (isDemo) {
      setTodayStatus({
        data: getDummyMutabaahTodayStatus(),
        loading: false,
        error: null,
      });
      return;
    }

    const id = ++fetchRef.current;
    setTodayStatus((s) => ({ ...s, loading: true, error: null }));

    fetchMutabaahToday()
      .then((res) => {
        if (id === fetchRef.current) {
          setTodayStatus({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error
              ? err.message
              : "Gagal memuat status Mutaba'ah";
          setTodayStatus({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo]);

  useEffect(() => {
    refetchToday();
  }, [refetchToday]);

  const submitToday = useCallback(
    async (attendanceLogId: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setActionLoading(true);
      try {
        const res = await submitMutabaahApi({
          attendance_log_id: attendanceLogId,
        });
        toast.success("Tilawah berhasil dicatat");
        refetchToday();
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal mencatat tilawah";
        toast.error(message);
        return null;
      } finally {
        setActionLoading(false);
      }
    },
    [isDemo, refetchToday, onSuccess],
  );

  const cancelToday = useCallback(
    async (mutabaahLogId: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setActionLoading(true);
      try {
        const res = await cancelMutabaahApi({
          mutabaah_log_id: mutabaahLogId,
        });
        toast.success("Tilawah dibatalkan");
        refetchToday();
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal membatalkan tilawah";
        toast.error(message);
        return null;
      } finally {
        setActionLoading(false);
      }
    },
    [isDemo, refetchToday, onSuccess],
  );

  return {
    todayStatus,
    actionLoading,
    submitToday,
    cancelToday,
    refetchToday,
  };
}

// ════════════════════════════════════════════
// useMutabaahReport — Fetch report data
// ════════════════════════════════════════════

export function useMutabaahDailyReport(date: string) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<MutabaahDailyReport[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (isDemo) {
      setState({
        data: getDummyMutabaahDailyReport(),
        loading: false,
        error: null,
      });
      return;
    }

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchMutabaahDailyReport(date)
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
  }, [isDemo, date]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useMutabaahMonthlyReport(month: number, year: number) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<MutabaahMonthlySummary[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (isDemo) {
      setState({
        data: getDummyMutabaahMonthlySummary(),
        loading: false,
        error: null,
      });
      return;
    }

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchMutabaahMonthlyReport(month, year)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error
              ? err.message
              : "Gagal memuat laporan bulanan";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo, month, year]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useMutabaahCategoryReport(date: string) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<MutabaahCategorySummary[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (isDemo) {
      setState({
        data: getDummyMutabaahCategorySummary(),
        loading: false,
        error: null,
      });
      return;
    }

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchMutabaahCategoryReport(date)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error
              ? err.message
              : "Gagal memuat perbandingan kategori";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo, date]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}