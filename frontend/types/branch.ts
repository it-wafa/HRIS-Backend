// ════════════════════════════════════════════
// BRANCH TYPES
// ════════════════════════════════════════════

export interface Branch {
  id: number;
  code: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  radius_meters: number;
  allow_wfh: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateBranchPayload {
  code: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  radius_meters?: number;
  allow_wfh?: boolean;
}

export interface UpdateBranchPayload {
  code?: string;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  radius_meters?: number;
  allow_wfh?: boolean;
}
