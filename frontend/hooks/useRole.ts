import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type {
  Role,
  Permission,
  CreateRolePayload,
  UpdateRolePayload,
} from "@/types/role";
import {
  fetchRoles,
  fetchRoleById,
  createRole as createRoleApi,
  updateRole as updateRoleApi,
  deleteRole as deleteRoleApi,
  fetchPermissions,
  updateRolePermissions as updateRolePermissionsApi,
} from "@/lib/role-api";
import {
  getDummyRoles,
  getDummyRoleById,
  getDummyPermissions,
  getDummyRolePermissions,
} from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useRoleList — Fetch all roles
// ════════════════════════════════════════════

export function useRoleList() {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Role[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({ data: getDummyRoles(), loading: false, error: null });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchRoles()
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch roles";
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
// useRoleById — Fetch single role with permissions
// ════════════════════════════════════════════

export function useRoleById(id: number | null) {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Role>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (!id) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    // Demo mode: use dummy data
    if (isDemo) {
      const role = getDummyRoleById(id);
      setState({
        data: role || null,
        loading: false,
        error: role ? null : "Role not found",
      });
      return;
    }

    // Live mode: fetch from API
    const reqId = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchRoleById(id)
      .then((res) => {
        if (reqId === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (reqId === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch role";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [isDemo, id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// usePermissionList — Fetch all permissions
// ════════════════════════════════════════════

export function usePermissionList() {
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Permission[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({ data: getDummyPermissions(), loading: false, error: null });
      return;
    }

    // Live mode: fetch from API
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchPermissions()
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch permissions";
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
// useRolePermissions — Get permission codes for a role (demo + live mode)
// ════════════════════════════════════════════

export function useRolePermissions(roleId: number | null): string[] {
  const { isDemo } = useDemo();
  const [permissionCodes, setPermissionCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!roleId) {
      setPermissionCodes([]);
      return;
    }

    if (isDemo) {
      setPermissionCodes(getDummyRolePermissions(roleId));
      return;
    }

    // Live mode: reuse existing GET /roles/:id which already returns permissions[]
    fetchRoleById(roleId)
      .then((res) => {
        const codes = res.data.permissions?.map((p) => p.code) ?? [];
        setPermissionCodes(codes);
      })
      .catch(() => setPermissionCodes([]));
  }, [roleId, isDemo]);

  return permissionCodes;
}

// ════════════════════════════════════════════
// useRoleMutations — CRUD operations
// ════════════════════════════════════════════

export function useRoleMutations(onSuccess?: () => void) {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createRole = useCallback(
    async (payload: CreateRolePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await createRoleApi(payload);
        toast.success("Role berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menambahkan role";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const updateRole = useCallback(
    async (id: number, payload: UpdateRolePayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await updateRoleApi(id, payload);
        toast.success("Role berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui role";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const deleteRole = useCallback(
    async (id: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }
      setLoading(true);
      try {
        await deleteRoleApi(id);
        toast.success("Role berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus role";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  const updateRolePermissions = useCallback(
    async (roleId: number, permissionCodes: string[]) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      setLoading(true);
      try {
        const res = await updateRolePermissionsApi(roleId, {
          permission_codes: permissionCodes,
        });
        toast.success("Permissions berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui permissions";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo, onSuccess],
  );

  return { loading, createRole, updateRole, deleteRole, updateRolePermissions };
}
