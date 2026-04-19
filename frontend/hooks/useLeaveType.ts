import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  LeaveType,
  CreateLeaveTypePayload,
  UpdateLeaveTypePayload,
} from "@/types/leave";
import {
  fetchLeaveTypes,
  createLeaveType as createLeaveTypeApi,
  updateLeaveType as updateLeaveTypeApi,
  deleteLeaveType as deleteLeaveTypeApi,
} from "@/lib/leave-type-api";
import { getDummyLeaveTypes } from "@/lib/dummy";
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
// useLeaveTypeList — List All Leave Types (§1.5)
// ══════════════════════════════════════════════════════════════════════════════

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

// ══════════════════════════════════════════════════════════════════════════════
// useLeaveTypeMutations — CRUD Operations for Leave Types (§1.5)
// ══════════════════════════════════════════════════════════════════════════════

interface LeaveTypeMutationsReturn {
  loading: boolean;
  createLeaveType: (
    payload: CreateLeaveTypePayload,
  ) => Promise<LeaveType | null>;
  updateLeaveType: (
    id: number,
    payload: UpdateLeaveTypePayload,
  ) => Promise<LeaveType | null>;
  deleteLeaveType: (id: number) => Promise<boolean>;
}

export function useLeaveTypeMutations(
  onSuccess?: () => void,
): LeaveTypeMutationsReturn {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createLeaveType = useCallback(
    async (payload: CreateLeaveTypePayload): Promise<LeaveType | null> => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }

      setLoading(true);
      try {
        const res = await createLeaveTypeApi(payload);
        toast.success("Jenis cuti berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menambahkan jenis cuti";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const updateLeaveType = useCallback(
    async (
      id: number,
      payload: UpdateLeaveTypePayload,
    ): Promise<LeaveType | null> => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }

      setLoading(true);
      try {
        const res = await updateLeaveTypeApi(id, payload);
        toast.success("Jenis cuti berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui jenis cuti";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const deleteLeaveType = useCallback(
    async (id: number): Promise<boolean> => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }

      setLoading(true);
      try {
        await deleteLeaveTypeApi(id);
        toast.success("Jenis cuti berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus jenis cuti";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return {
    loading,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
  };
}
