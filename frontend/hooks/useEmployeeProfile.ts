import { useState, useEffect, useCallback } from "react";
import { useDemo } from "@/contexts/DemoContext";

import type { EmployeeProfile, EmployeeProfileContact } from "@/types/profile";
import { getDummyEmployeeProfile, getDummyProfileContacts } from "@/lib/dummy";
import {
  fetchEmployeeProfile,
  fetchEmployeeProfileContacts,
} from "@/lib/profile-api";

// ════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// HOOK: useEmployeeProfile
// Fetches employee profile data for the logged-in user
// ════════════════════════════════════════════

export function useEmployeeProfile() {
  const { isDemo } = useDemo();

  const [state, setState] = useState<AsyncState<EmployeeProfile>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    if (isDemo) {
      setState({
        data: getDummyEmployeeProfile(),
        loading: false,
        error: null,
      });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchEmployeeProfile()
      .then((res) => {
        setState({ data: res.data, loading: false, error: null });
      })
      .catch((err) => {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Gagal memuat data profil";
        setState({ data: null, loading: false, error: message });
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    ...state,
    refetch,
  };
}

// ════════════════════════════════════════════
// HOOK: useEmployeeProfileContacts
// Fetches contact information for the logged-in user
// ════════════════════════════════════════════

export function useEmployeeProfileContacts() {
  const { isDemo } = useDemo();

  const [state, setState] = useState<AsyncState<EmployeeProfileContact[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    if (isDemo) {
      setState({
        data: getDummyProfileContacts(),
        loading: false,
        error: null,
      });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchEmployeeProfileContacts()
      .then((res) => {
        setState({ data: res.data, loading: false, error: null });
      })
      .catch((err) => {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Gagal memuat data kontak";
        setState({ data: null, loading: false, error: message });
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    ...state,
    refetch,
  };
}
