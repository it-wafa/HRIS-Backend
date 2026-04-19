import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";

/** Hook untuk cek permission user */
export function usePermission() {
  const { permissions } = useAuth();
  const { isDemo } = useDemo();

  const hasPermission = (perm: string): boolean => {
    if (isDemo) return true;
    return permissions.includes(perm);
  };

  const hasAnyPermission = (...perms: string[]): boolean => {
    if (isDemo) return true;
    return perms.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (...perms: string[]): boolean => {
    if (isDemo) return true;
    return perms.every((p) => permissions.includes(p));
  };

  return { hasPermission, hasAnyPermission, hasAllPermissions, permissions };
}
