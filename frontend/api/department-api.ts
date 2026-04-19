import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  DepartmentListParams,
  DepartmentMetadata,
} from "@/types/department";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// DEPARTMENT API
// ════════════════════════════════════════════

/** GET /departments/metadata — Fetch department metadata */
export async function fetchDepartmentMetadata() {
  return apiCall<DepartmentMetadata>("/departments/metadata");
}

/** GET /departments — List all departments */
export async function fetchDepartments(
  params?: DepartmentListParams,
) {
  const searchParams = new URLSearchParams();
  if (params?.branch_id !== undefined) {
    searchParams.append("branch_id", String(params.branch_id));
  }
  if (params?.is_active !== undefined) {
    searchParams.append("is_active", String(params.is_active));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/departments?${query}` : "/departments";

  return apiCall<Department[]>(endpoint);
}

/** GET /departments/:id — Get department by ID */
export async function fetchDepartmentById(id: number) {
  return apiCall<Department>(`/departments/${id}`);
}

/** POST /departments — Create a new department */
export async function createDepartment(
  payload: CreateDepartmentPayload,
) {
  return apiCall<Department>("/departments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /departments/:id — Update a department */
export async function updateDepartment(
  id: number,
  payload: UpdateDepartmentPayload,
) {
  return apiCall<Department>(`/departments/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /departments/:id — Delete a department */
export async function deleteDepartment(id: number) {
  return apiCall<{ message: string }>(`/departments/${id}`, {
    method: "DELETE",
  });
}
