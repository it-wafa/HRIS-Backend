// ════════════════════════════════════════════
// JOB POSITION TYPES
// ════════════════════════════════════════════

export interface JobPosition {
  id: number;
  title: string;
  department_id: number | null;
  department_name?: string; // joined field untuk display
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreatePositionPayload {
  title: string;
  department_id?: number | null;
}

export interface UpdatePositionPayload {
  title?: string;
  department_id?: number | null;
}