import type {
  Branch,
  CreateBranchPayload,
  UpdateBranchPayload,
} from "@/types/branch";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// BRANCH API
// ════════════════════════════════════════════

/** GET /branches — List all branches */
export async function fetchBranches() {
  return apiCall<Branch[]>("/branches");
}

/** GET /branches/:id — Get branch by ID */
export async function fetchBranchById(id: number) {
  return apiCall<Branch>(`/branches/${id}`);
}

/** POST /branches — Create a new branch */
export async function createBranch(
  payload: CreateBranchPayload,
) {
  return apiCall<Branch>("/branches", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /branches/:id — Update a branch */
export async function updateBranch(
  id: number,
  payload: UpdateBranchPayload,
) {
  return apiCall<Branch>(`/branches/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** DELETE /branches/:id — Delete a branch */
export async function deleteBranch(id: number) {
  return apiCall<{ message: string }>(`/branches/${id}`, {
    method: "DELETE",
  });
}
