import type {
  Profile,
  UpdateProfilePayload,
  UploadPhotoPayload,
  UploadPhotoResponse,
  EmployeeProfile,
  EmployeeProfileContact,
} from "@/types/profile";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// PROFILE API
// ════════════════════════════════════════════

/** GET /profile — Get user profile */
export async function fetchProfile() {
  return apiCall<Profile>("/profile");
}

/** PUT /profile — Update user profile */
export async function updateProfile(
  payload: UpdateProfilePayload,
) {
  return apiCall<Profile>("/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** POST /profile/photo — Upload profile photo */
export async function uploadProfilePhoto(
  payload: UploadPhotoPayload,
) {
  return apiCall<UploadPhotoResponse>("/profile/photo", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** DELETE /profile/photo — Delete profile photo */
export async function deleteProfilePhoto() {
  return apiCall<{ message: string }>("/profile/photo", {
    method: "DELETE",
  });
}

// ════════════════════════════════════════════
// EMPLOYEE PROFILE API (for ProfilePage)
// ════════════════════════════════════════════

/** GET /profile/employee — Get detailed employee profile */
export async function fetchEmployeeProfile() {
  return apiCall<EmployeeProfile>("/profile/employee");
}

/** GET /profile/employee/contacts — Get own contacts */
export async function fetchEmployeeProfileContacts() {
  return apiCall<EmployeeProfileContact[]>("/profile/employee/contacts");
}

// ════════════════════════════════════════════
// CHANGE PASSWORD API
// ════════════════════════════════════════════

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/** POST /profile/change-password — Change own password */
export async function changePassword(payload: ChangePasswordPayload) {
  return apiCall<{ message: string }>("/profile/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
