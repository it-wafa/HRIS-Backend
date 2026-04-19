import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  EmployeeDashboardData,
  HRDDashboardData,
  TodayAttendanceStatus,
  ClockInPayload,
  ClockOutPayload,
} from "@/types/dashboard";
import {
  fetchEmployeeDashboard,
  fetchHRDDashboard,
  clockIn as clockInApi,
  clockOut as clockOutApi,
} from "@/lib/dashboard-api";
import {
  getDummyEmployeeDashboard,
  getDummyHRDDashboard,
  getDummyTodayStatus,
} from "@/lib/dummy";
import toast from "react-hot-toast";

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ══════════════════════════════════════════════════════════════════════════════
// useEmployeeDashboard — Employee Dashboard Data (§13.1)
// ══════════════════════════════════════════════════════════════════════════════

export function useEmployeeDashboard() {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<EmployeeDashboardData>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyEmployeeDashboard(true),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchEmployeeDashboard()
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
              : "Gagal memuat dashboard pegawai";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ══════════════════════════════════════════════════════════════════════════════
// useHRDDashboard — HRD/Supervisor Dashboard Data (§13.2)
// ══════════════════════════════════════════════════════════════════════════════

export function useHRDDashboard() {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<HRDDashboardData>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyHRDDashboard(),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchHRDDashboard()
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat dashboard HRD";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ══════════════════════════════════════════════════════════════════════════════
// useClockWidget — Clock In/Out Widget State (§13.3)
// ══════════════════════════════════════════════════════════════════════════════

interface ClockWidgetHookReturn {
  status: TodayAttendanceStatus | null;
  isMobile: boolean;
  loading: boolean;
  clockIn: (payload: ClockInPayload) => Promise<boolean>;
  clockOut: (payload: ClockOutPayload) => Promise<boolean>;
  refetch: () => void;
}

/**
 * Detect if device is mobile
 */
function detectMobile(): boolean {
  if (typeof window === "undefined") return false;

  const isMobileWidth = window.innerWidth < 768;
  const isMobileUserAgent =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  return isMobileWidth || isMobileUserAgent;
}

export function useClockWidget(): ClockWidgetHookReturn {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(detectMobile());
  const [status, setStatus] = useState<TodayAttendanceStatus | null>(
    isDemo ? getDummyTodayStatus(false) : null,
  );

  const fetchRef = useRef(0);

  // Detect mobile on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(detectMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch current status
  const refetch = useCallback(() => {
    if (isDemo) {
      // In demo mode, use dummy data
      // Simulate already clocked in for demo
      setStatus(getDummyTodayStatus(true));
      return;
    }

    // Live mode: fetch from employee dashboard to get today status
    const id = ++fetchRef.current;
    setLoading(true);

    fetchEmployeeDashboard()
      .then((res) => {
        if (id === fetchRef.current) {
          setStatus(res.data.today);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          console.error("Failed to fetch today status:", err);
          setLoading(false);
        }
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Clock In
  const clockIn = useCallback(
    async (payload: ClockInPayload): Promise<boolean> => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }

      setLoading(true);
      try {
        await clockInApi(payload);
        toast.success("Clock in berhasil");
        refetch();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal melakukan clock in";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, refetch],
  );

  // Clock Out
  const clockOut = useCallback(
    async (payload: ClockOutPayload): Promise<boolean> => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }

      setLoading(true);
      try {
        await clockOutApi(payload);
        toast.success("Clock out berhasil");
        refetch();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal melakukan clock out";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, refetch],
  );

  return {
    status,
    isMobile,
    loading,
    clockIn,
    clockOut,
    refetch,
  };
}
