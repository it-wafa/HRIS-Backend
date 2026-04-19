import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  DepartmentListParams,
} from "@/types/department";
import {
  fetchDepartments,
  createDepartment as createDepartmentApi,
  updateDepartment as updateDepartmentApi,
  deleteDepartment as deleteDepartmentApi,
} from "@/lib/department-api";
import { getDummyDepartments } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useDepartmentList — Fetch all departments
// ════════════════════════════════════════════

export function useDepartmentList(params?: DepartmentListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Department[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyDepartments(params),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchDepartments(params)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch departments";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo, params?.branch_id, params?.is_active]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useDepartmentMutations — CRUD operations
// ════════════════════════════════════════════

export function useDepartmentMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createDepartment = useCallback(
    async (payload: CreateDepartmentPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createDepartmentApi(payload);
        toast.success("Departemen berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menambahkan departemen";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const updateDepartment = useCallback(
    async (id: number, payload: UpdateDepartmentPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await updateDepartmentApi(id, payload);
        toast.success("Departemen berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui departemen";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const deleteDepartment = useCallback(
    async (id: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }
      setLoading(true);
      try {
        await deleteDepartmentApi(id);
        toast.success("Departemen berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus departemen";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createDepartment, updateDepartment, deleteDepartment };
}
