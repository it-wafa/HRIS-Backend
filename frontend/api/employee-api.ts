import type {
  Employee,
  EmployeeContact,
  EmployeeListParams,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  CreateContactPayload,
  UpdateContactPayload,
  EmployeeMetadata,
  CreateEmployeeResponse,
} from "@/types/employee";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// EMPLOYEE API
// ════════════════════════════════════════════

/** GET /employees/metadata — Fetch user metadata map */
export async function fetchEmployeeMetadata() {
  return apiCall<EmployeeMetadata>("/employees/metadata");
}

/** GET /employees — List all employees with optional filters */
export async function fetchEmployees(
  params?: EmployeeListParams,
) {
  const query = new URLSearchParams();
  if (params?.branch_id) query.set("branch_id", params.branch_id.toString());
  if (params?.is_active !== undefined)
    query.set("is_active", params.is_active.toString());
  if (params?.search) query.set("search", params.search);

  const queryString = query.toString();
  const endpoint = queryString ? `/employees?${queryString}` : "/employees";

  return apiCall<Employee[]>(endpoint);
}

/** GET /employees/:id — Get employee by ID */
export async function fetchEmployeeById(id: number) {
  return apiCall<Employee>(`/employees/${id}`);
}

export async function createEmployee(
  payload: CreateEmployeePayload,
) {
  return apiCall<CreateEmployeeResponse>("/employees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /employees/:id — Update an employee */
export async function updateEmployee(
  id: number,
  payload: UpdateEmployeePayload,
) {
  return apiCall<Employee>(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /employees/:id — Delete an employee */
export async function deleteEmployee(id: number) {
  return apiCall<{ message: string }>(`/employees/${id}`, {
    method: "DELETE",
  });
}

// ════════════════════════════════════════════
// EMPLOYEE CONTACT API
// ════════════════════════════════════════════

/** GET /employees/:employeeId/contacts — List contacts for an employee */
export async function fetchEmployeeContacts(employeeId: number) {
  return apiCall<EmployeeContact[]>(`/employees/${employeeId}/contacts`);
}

/** POST /employees/:employeeId/contacts — Create a new contact */
export async function createEmployeeContact(
  employeeId: number,
  payload: CreateContactPayload,
) {
  return apiCall<EmployeeContact>(`/employees/${employeeId}/contacts`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /employee-contacts/:id — Update a contact */
export async function updateEmployeeContact(
  contactId: number,
  payload: UpdateContactPayload,
) {
  return apiCall<EmployeeContact>(`/employee-contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /employee-contacts/:id — Delete a contact */
export async function deleteEmployeeContact(contactId: number) {
  return apiCall<{ message: string }>(`/employee-contacts/${contactId}`, {
    method: "DELETE",
  });
}

// ════════════════════════════════════════════
// EMPLOYEE PASSWORD RESET API
// ════════════════════════════════════════════

export interface ResetPasswordPayload {
  new_password: string;
  confirm_password: string;
}

/** PATCH /employees/:id/reset-password — Reset password for an employee (admin only) */
export async function resetEmployeePassword(
  employeeId: number,
  payload: ResetPasswordPayload,
) {
  return apiCall<{ message: string }>(
    `/employees/${employeeId}/reset-password`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}
