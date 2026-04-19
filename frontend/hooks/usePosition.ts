import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  JobPosition,
  CreatePositionPayload,
  UpdatePositionPayload,
} from "@/types/job-position";
import {
  fetchPositions,
  createPosition as createPositionApi,
  updatePosition as updatePositionApi,
  deletePosition as deletePositionApi,
} from "@/lib/position-api";
import { getDummyPositions } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// usePositionList — Fetch all positions
// ════════════════════════════════════════════

export function usePositionList(departmentId?: number) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<JobPosition[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({ data: getDummyPositions(), loading: false, error: null });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchPositions(departmentId)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch positions";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo, departmentId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// usePositionMutations — CRUD operations
// ════════════════════════════════════════════

export function usePositionMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createPosition = useCallback(
    async (payload: CreatePositionPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createPositionApi(payload);
        toast.success("Jabatan berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menambahkan jabatan";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const updatePosition = useCallback(
    async (id: number, payload: UpdatePositionPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await updatePositionApi(id, payload);
        toast.success("Jabatan berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui jabatan";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const deletePosition = useCallback(
    async (id: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }
      setLoading(true);
      try {
        await deletePositionApi(id);
        toast.success("Jabatan berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus jabatan";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createPosition, updatePosition, deletePosition };
}
