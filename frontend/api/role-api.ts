import type {
  Role,
  Permission,
  CreateRolePayload,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
  RoleMetadata,
} from "@/types/role";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// ROLE API
// ════════════════════════════════════════════

export async function fetchRoleMetadata() {
  return apiCall<RoleMetadata>("/roles/metadata");
}

/** GET /roles — List all roles */
export async function fetchRoles() {
  return apiCall<Role[]>("/roles");
}

/** GET /roles/:id — Get role by ID (with permissions) */
export async function fetchRoleById(id: number) {
  return apiCall<Role>(`/roles/${id}`);
}

/** POST /roles — Create a new role */
export async function createRole(payload: CreateRolePayload) {
  return apiCall<Role>("/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /roles/:id — Update a role */
export async function updateRole(
  id: number,
  payload: UpdateRolePayload,
) {
  return apiCall<Role>(`/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /roles/:id — Delete a role */
export async function deleteRole(id: number) {
  return apiCall<{ message: string }>(`/roles/${id}`, {
    method: "DELETE",
  });
}

// ════════════════════════════════════════════
// PERMISSION API
// ════════════════════════════════════════════

/** GET /permissions — List all permissions */
export async function fetchPermissions() {
  return apiCall<Permission[]>("/permissions");
}

/** PUT /roles/:id/permissions — Update role permissions */
export async function updateRolePermissions(
  roleId: number,
  payload: UpdateRolePermissionsPayload,
) {
  return apiCall<Role>(`/roles/${roleId}/permissions`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
