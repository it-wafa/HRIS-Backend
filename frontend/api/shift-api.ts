import type {
  ShiftTemplate,
  ShiftTemplateDetail,
  CreateShiftPayload,
  UpdateShiftPayload,
  EmployeeSchedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  ScheduleListParams,
  ShiftMetadata,
} from "@/types/shift";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// SHIFT METADATA
// ════════════════════════════════════════════

/** GET /shifts/metadata — Fetch shift metadata */
export async function fetchShiftMetadata() {
  return apiCall<ShiftMetadata>("/shifts/metadata");
}

// ════════════════════════════════════════════
// SHIFT TEMPLATE API
// ════════════════════════════════════════════

/** GET /shifts — List all shift templates */
export async function fetchShiftTemplates() {
  return apiCall<ShiftTemplate[]>("/shifts");
}

/** GET /shifts/:id — Get shift template by ID */
export async function fetchShiftTemplateById(id: number) {
  return apiCall<ShiftTemplate>(`/shifts/${id}`);
}

/** POST /shifts — Create a new shift template */
export async function createShiftTemplate(
  payload: CreateShiftPayload,
) {
  return apiCall<ShiftTemplate>("/shifts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /shifts/:id — Update a shift template */
export async function updateShiftTemplate(
  id: number,
  payload: UpdateShiftPayload,
) {
  return apiCall<ShiftTemplate>(`/shifts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /shifts/:id — Delete a shift template */
export async function deleteShiftTemplate(id: number) {
  return apiCall<{ message: string }>(`/shifts/${id}`, {
    method: "DELETE",
  });
}

/** GET /shifts/:id/details — Get details for a shift template */
export async function fetchShiftTemplateDetails(
  shiftId: number,
) {
  return apiCall<ShiftTemplateDetail[]>(`/shifts/${shiftId}/details`);
}

// ════════════════════════════════════════════
// EMPLOYEE SCHEDULE API
// ════════════════════════════════════════════

/** GET /schedules — List all employee schedules */
export async function fetchEmployeeSchedules(
  params?: ScheduleListParams,
) {
  const searchParams = new URLSearchParams();
  if (params?.employee_id !== undefined) {
    searchParams.append("employee_id", String(params.employee_id));
  }
  if (params?.shift_template_id !== undefined) {
    searchParams.append("shift_template_id", String(params.shift_template_id));
  }
  if (params?.is_active !== undefined) {
    searchParams.append("is_active", String(params.is_active));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/schedules?${query}` : "/schedules";

  return apiCall<EmployeeSchedule[]>(endpoint);
}

/** GET /schedules/:id — Get employee schedule by ID */
export async function fetchEmployeeScheduleById(id: number) {
  return apiCall<EmployeeSchedule>(`/schedules/${id}`);
}

/** POST /schedules — Create a new employee schedule */
export async function createEmployeeSchedule(
  payload: CreateSchedulePayload,
) {
  return apiCall<EmployeeSchedule>("/schedules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /schedules/:id — Update an employee schedule */
export async function updateEmployeeSchedule(
  id: number,
  payload: UpdateSchedulePayload,
) {
  return apiCall<EmployeeSchedule>(`/schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /schedules/:id — Delete an employee schedule */
export async function deleteEmployeeSchedule(id: number) {
  return apiCall<{ message: string }>(`/schedules/${id}`, {
    method: "DELETE",
  });
}
