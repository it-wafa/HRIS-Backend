import type {
  EmploymentContract,
  CreateContractPayload,
  UpdateContractPayload,
} from "@/types/contract";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// CONTRACT API
// ════════════════════════════════════════════

/** GET /employees/:employeeId/contracts — List contracts for an employee */
export async function fetchContracts(employeeId: number) {
  return apiCall<EmploymentContract[]>(`/employees/${employeeId}/contracts`);
}

/** POST /employees/:employeeId/contracts — Create a new contract */
export async function createContract(
  employeeId: number,
  payload: CreateContractPayload,
) {
  return apiCall<EmploymentContract>(`/employees/${employeeId}/contracts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /contracts/:id — Update a contract */
export async function updateContract(
  id: number,
  payload: UpdateContractPayload,
) {
  return apiCall<EmploymentContract>(`/contracts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /contracts/:id — Delete a contract */
export async function deleteContract(id: number) {
  return apiCall<{ message: string }>(`/contracts/${id}`, {
    method: "DELETE",
  });
}
