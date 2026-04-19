import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  BusinessTripRequest,
  CreateBusinessTripPayload,
  UpdateBusinessTripStatusPayload,
  BusinessTripListParams,
} from "@/types/business-trip";
import {
  fetchBusinessTrips,
  createBusinessTrip as createTripApi,
  updateBusinessTripStatus as updateStatusApi,
  deleteBusinessTrip as deleteTripApi,
} from "@/lib/business-trip-api";
import { getDummyBusinessTrips } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useBusinessTripList — Fetch business trip requests
// ════════════════════════════════════════════

export function useBusinessTripList(params?: BusinessTripListParams) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<BusinessTripRequest[]>>({
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
        data: getDummyBusinessTrips(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchBusinessTrips(paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat data dinas luar";
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
// useBusinessTripMutations — CRUD operations
// ════════════════════════════════════════════

export function useBusinessTripMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createTrip = useCallback(
    async (payload: CreateBusinessTripPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createTripApi(payload);
        toast.success("Pengajuan dinas luar berhasil dikirim");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal mengajukan dinas luar";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const approveTrip = useCallback(
    async (id: number, notes?: string) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      const payload: UpdateBusinessTripStatusPayload = {
        status: "approved",
        approver_notes: notes,
      };

      setLoading(true);
      try {
        const res = await updateStatusApi(id, payload);
        toast.success("Dinas luar disetujui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menyetujui dinas luar";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const rejectTrip = useCallback(
    async (id: number, notes?: string) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      const payload: UpdateBusinessTripStatusPayload = {
        status: "rejected",
        approver_notes: notes,
      };

      setLoading(true);
      try {
        const res = await updateStatusApi(id, payload);
        toast.success("Dinas luar ditolak");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menolak dinas luar";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const deleteTrip = useCallback(
    async (id: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }
      setLoading(true);
      try {
        await deleteTripApi(id);
        toast.success("Pengajuan dinas luar berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus pengajuan";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createTrip, approveTrip, rejectTrip, deleteTrip };
}
