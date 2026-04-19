import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  LeaveType,
  LeaveBalance,
  LeaveRequest,
  CreateLeavePayload,
  ApproveLeavePayload,
  RejectLeavePayload,
  LeaveListParams,
  LeaveBalanceListParams,
} from "@/types/leave";
import {
  fetchLeaveTypes,
  fetchLeaveBalances,
  fetchLeaveRequests,
  createLeaveRequest as createRequestApi,
  approveLeaveRequest as approveRequestApi,
  rejectLeaveRequest as rejectRequestApi,
} from "@/lib/leave-api";
import {
  getDummyLeaveTypes,
  getDummyLeaveBalances,
  getDummyLeaveRequests,
} from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useLeaveTypeList — Fetch all leave types (read-only)
// ════════════════════════════════════════════

export function useLeaveTypeList() {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<LeaveType[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyLeaveTypes(),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchLeaveTypes()
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat jenis cuti";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useLeaveBalanceList — Fetch leave balances
// ════════════════════════════════════════════

export function useLeaveBalanceList(params?: LeaveBalanceListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<LeaveBalance[]>>({
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
        data: getDummyLeaveBalances(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchLeaveBalances(paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat saldo cuti";
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
  }, [params?.employee_id, params?.year]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useLeaveRequestList — Fetch leave requests
// ════════════════════════════════════════════

export function useLeaveRequestList(params?: LeaveListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<LeaveRequest[]>>({
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
        data: getDummyLeaveRequests(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchLeaveRequests(paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat pengajuan cuti";
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
    params?.status,
    params?.leave_type_id,
    params?.year,
  ]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useLeaveRequestMutations — CRUD operations
// ════════════════════════════════════════════

export function useLeaveRequestMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createRequest = useCallback(
    async (payload: CreateLeavePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createRequestApi(payload);
        toast.success("Pengajuan cuti berhasil dikirim");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal mengajukan cuti";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const approveRequest = useCallback(
    async (id: number, payload?: ApproveLeavePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await approveRequestApi(id, payload);
        toast.success("Cuti disetujui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menyetujui cuti";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const rejectRequest = useCallback(
    async (id: number, payload: RejectLeavePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await rejectRequestApi(id, payload);
        toast.success("Cuti ditolak");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menolak cuti";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createRequest, approveRequest, rejectRequest };
}
