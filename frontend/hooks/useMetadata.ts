import { useState, useEffect, useCallback } from "react";
import { useDemo } from "@/contexts/DemoContext";
import { fetchEmployeeMetadata } from "@/lib/employee-api";
import { fetchRoleMetadata } from "@/lib/role-api";
import { fetchDepartmentMetadata } from "@/lib/department-api";
import { fetchLeaveTypeMetadata } from "@/lib/leave-type-api";
import { fetchShiftMetadata } from "@/lib/shift-api";
import { fetchHolidayMetadata } from "@/lib/holiday-api";
import { getDummyEmployeeMetadata } from "@/lib/dummy/employee.dummy";
import { getDummyRoleMetadata } from "@/lib/dummy/role.dummy";
import { getDummyDepartmentMetadata } from "@/lib/dummy/department.dummy";
import { getDummyLeaveTypeMetadata } from "@/lib/dummy/leave.dummy";
import { getDummyShiftMetadata } from "@/lib/dummy/shift.dummy";
import { getDummyHolidayMetadata } from "@/lib/dummy/holiday.dummy";
import { fetchAttendanceMetadata } from "@/lib/attendance-api";
import type { EmployeeMetadata } from "@/types/employee";
import type { RoleMetadata } from "@/types/role";
import type { DepartmentMetadata } from "@/types/department";
import type { LeaveTypeMetadata } from "@/types/leave";
import type { ShiftMetadata } from "@/types/shift";
import type { HolidayMetadata } from "@/types/holiday";
import type { AttendanceMetadata } from "@/types/attendance";

// ════════════════════════════════════════════
// Generic metadata hook factory
// ════════════════════════════════════════════

function useGenericMetadata<T>(
  isDemo: boolean,
  dummyFn: () => T,
  apiFn: () => Promise<{ data: T }>,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (isDemo) {
      setData(dummyFn());
      setLoading(false);
      return;
    }

    setLoading(true);
    apiFn()
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load metadata");
      })
      .finally(() => setLoading(false));
  }, [isDemo, dummyFn, apiFn]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// ════════════════════════════════════════════
// Exported hooks
// ════════════════════════════════════════════

export function useEmployeeMetadata() {
  const { isDemo } = useDemo();
  return useGenericMetadata<EmployeeMetadata>(
    isDemo,
    getDummyEmployeeMetadata,
    fetchEmployeeMetadata,
  );
}

export function useRoleMetadata() {
  const { isDemo } = useDemo();
  return useGenericMetadata<RoleMetadata>(
    isDemo,
    getDummyRoleMetadata,
    fetchRoleMetadata,
  );
}

export function useDepartmentMetadata() {
  const { isDemo } = useDemo();
  return useGenericMetadata<DepartmentMetadata>(
    isDemo,
    getDummyDepartmentMetadata,
    fetchDepartmentMetadata,
  );
}

export function useLeaveTypeMetadata() {
  const { isDemo } = useDemo();
  return useGenericMetadata<LeaveTypeMetadata>(
    isDemo,
    getDummyLeaveTypeMetadata,
    fetchLeaveTypeMetadata,
  );
}

export function useShiftMetadata() {
  const { isDemo } = useDemo();
  return useGenericMetadata<ShiftMetadata>(
    isDemo,
    getDummyShiftMetadata,
    fetchShiftMetadata,
  );
}

export function useHolidayMetadata() {
  const { isDemo } = useDemo();
  return useGenericMetadata<HolidayMetadata>(
    isDemo,
    getDummyHolidayMetadata,
    fetchHolidayMetadata,
  );
}

const getDummyAttendanceMetadataFallback = (): AttendanceMetadata => ({
  status_meta: [],
  clock_method_meta: [],
  override_type_meta: [],
  employee_meta: [],
});

export function useAttendanceMetadata() {
  const { isDemo } = useDemo();
  return useGenericMetadata<AttendanceMetadata>(
    isDemo,
    getDummyAttendanceMetadataFallback, // Dummy attendance metadata fallback
    fetchAttendanceMetadata,
  );
}
