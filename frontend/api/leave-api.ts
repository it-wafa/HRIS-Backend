import type {
  LeaveType,
  LeaveBalance,
  LeaveRequest,
  CreateLeavePayload,
  ApproveLeavePayload,
  RejectLeavePayload,
  LeaveListParams,
  LeaveBalanceListParams,
} from "@/types/leave";
import { apiCall } from "@/lib/api";

/** Build query string from params */
function buildQueryString<T extends object>(params?: T): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// ════════════════════════════════════════════
// LEAVE TYPE API
// ════════════════════════════════════════════

/** GET /leave-types — List all leave types */
export async function fetchLeaveTypes() {
  return apiCall<LeaveType[]>("/leave-types");
}

/** GET /leave-types/:id — Get leave type by ID */
export async function fetchLeaveTypeById(id: number) {
  return apiCall<LeaveType>(`/leave-types/${id}`);
}

// ════════════════════════════════════════════
// LEAVE BALANCE API
// ════════════════════════════════════════════

/** GET /leave-balances — List leave balances */
export async function fetchLeaveBalances(
  params?: LeaveBalanceListParams,
) {
  const query = buildQueryString(params);
  return apiCall<LeaveBalance[]>(`/leave-balances${query}`);
}

// ════════════════════════════════════════════
// LEAVE REQUEST API
// ════════════════════════════════════════════

/** GET /leave-requests — List leave requests */
export async function fetchLeaveRequests(
  params?: LeaveListParams,
) {
  const query = buildQueryString(params);
  return apiCall<LeaveRequest[]>(`/leave-requests${query}`);
}

/** GET /leave-requests/:id — Get leave request by ID */
export async function fetchLeaveRequestById(id: number) {
  return apiCall<LeaveRequest>(`/leave-requests/${id}`);
}

/** POST /leave-requests — Create a new leave request */
export async function createLeaveRequest(
  payload: CreateLeavePayload,
) {
  return apiCall<LeaveRequest>("/leave-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /leave-requests/:id/approve — Approve leave request */
export async function approveLeaveRequest(
  id: number,
  payload?: ApproveLeavePayload,
) {
  return apiCall<LeaveRequest>(`/leave-requests/${id}/approve`, {
    method: "PUT",
    body: JSON.stringify(payload || {}),
  });
}

/** PUT /leave-requests/:id/reject — Reject leave request */
export async function rejectLeaveRequest(
  id: number,
  payload: RejectLeavePayload,
) {
  return apiCall<LeaveRequest>(`/leave-requests/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
