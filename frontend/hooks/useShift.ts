import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  ShiftTemplate,
  CreateShiftPayload,
  UpdateShiftPayload,
  EmployeeSchedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  ScheduleListParams,
} from "@/types/shift";
import {
  fetchShiftTemplates,
  fetchShiftMetadata,
  createShiftTemplate as createShiftApi,
  updateShiftTemplate as updateShiftApi,
  deleteShiftTemplate as deleteShiftApi,
  fetchEmployeeSchedules,
  fetchEmployeeScheduleById,
  createEmployeeSchedule as createScheduleApi,
  updateEmployeeSchedule as updateScheduleApi,
  deleteEmployeeSchedule as deleteScheduleApi,
} from "@/lib/shift-api";
import { getDummyShiftTemplates, getDummyEmployeeSchedules, getDummyEmployeeScheduleById } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useShiftMetadata — Fetch shift form metadata
// ════════════════════════════════════════════

export function useShiftMetadata() {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<{ day_of_week_meta: { id: string; name: string }[] }>>(
    { data: null, loading: true, error: null }
  );

  useEffect(() => {
    if (isDemo) {
      // Demo: use static list matching backend
      setState({
        data: {
          day_of_week_meta: [
            { id: "monday",    name: "Senin" },
            { id: "tuesday",   name: "Selasa" },
            { id: "wednesday", name: "Rabu" },
            { id: "thursday",  name: "Kamis" },
            { id: "friday",    name: "Jumat" },
            { id: "saturday",  name: "Sabtu" },
            { id: "sunday",    name: "Minggu" },
          ],
        },
        loading: false,
        error: null,
      });
      return;
    }

    fetchShiftMetadata()
      .then((res) =>
        setState({ data: res.data, loading: false, error: null }),
      )
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to fetch shift metadata";
        setState({ data: null, loading: false, error: message });
      });
  }, [isDemo]);

  return state;
}

// ════════════════════════════════════════════
// useShiftList — Fetch all shift templates
// ════════════════════════════════════════════

export function useShiftList() {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<ShiftTemplate[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({ data: getDummyShiftTemplates(), loading: false, error: null });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchShiftTemplates()
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
              : "Failed to fetch shift templates";
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
// useShiftMutations — CRUD operations for shift templates
// ════════════════════════════════════════════

export function useShiftMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createShift = useCallback(
    async (payload: CreateShiftPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createShiftApi(payload);
        toast.success("Template shift berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal menambahkan template shift";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const updateShift = useCallback(
    async (id: number, payload: UpdateShiftPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await updateShiftApi(id, payload);
        toast.success("Template shift berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal memperbarui template shift";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const deleteShift = useCallback(
    async (id: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }
      setLoading(true);
      try {
        await deleteShiftApi(id);
        toast.success("Template shift berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus template shift";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createShift, updateShift, deleteShift };
}

// ════════════════════════════════════════════
// useScheduleList — Fetch all employee schedules
// ════════════════════════════════════════════

export function useScheduleList(params?: ScheduleListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<EmployeeSchedule[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyEmployeeSchedules(params),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchEmployeeSchedules(params)
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
              : "Failed to fetch employee schedules";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [
    isDemo,
    params?.employee_id,
    params?.shift_template_id,
    params?.is_active,
  ]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useScheduleMutations — CRUD operations for employee schedules
// ════════════════════════════════════════════

export function useScheduleMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createSchedule = useCallback(
    async (payload: CreateSchedulePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createScheduleApi(payload);
        toast.success("Jadwal pegawai berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal menambahkan jadwal pegawai";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const updateSchedule = useCallback(
    async (id: number, payload: UpdateSchedulePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await updateScheduleApi(id, payload);
        toast.success("Jadwal pegawai berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal memperbarui jadwal pegawai";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const deleteSchedule = useCallback(
    async (id: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }
      setLoading(true);
      try {
        await deleteScheduleApi(id);
        toast.success("Jadwal pegawai berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus jadwal pegawai";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createSchedule, updateSchedule, deleteSchedule };
}

// ════════════════════════════════════════════
// useScheduleById — Fetch single employee schedule
// ════════════════════════════════════════════

export function useScheduleById(id: number | null) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<EmployeeSchedule>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(() => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    if (isDemo) {
      const schedule = getDummyEmployeeScheduleById(id);
      setState({
        data: schedule || null,
        loading: false,
        error: schedule ? null : "Schedule not found",
      });
      return;
    }

    // Live mode
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchEmployeeScheduleById(id)
      .then((res) =>
        setState({ data: res.data, loading: false, error: null }),
      )
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Failed to fetch schedule";
        setState({ data: null, loading: false, error: message });
      });
  }, [isDemo, id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
