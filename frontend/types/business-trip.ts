export type TripStatus = "pending" | "approved" | "rejected";

export interface BusinessTripRequest {
  id: number;
  employee_id: number;
  employee_name?: string;
  destination: string;
  start_date: string;
  end_date: string;
  total_days: number;
  purpose: string;
  document_url: string | null;
  status: TripStatus;
  approved_by: number | null;
  approver_name?: string;
  approver_notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateBusinessTripPayload {
  destination: string;
  start_date: string;
  end_date: string;
  total_days: number;
  purpose: string;
  document_url?: string;
}

export interface UpdateBusinessTripStatusPayload {
  status: TripStatus;
  approver_notes?: string;
}

export interface BusinessTripListParams {
  employee_id?: number;
  status?: TripStatus;
}

export const TRIP_STATUS_OPTIONS: {
  value: TripStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu", color: "yellow" },
  { value: "approved", label: "Disetujui", color: "green" },
  { value: "rejected", label: "Ditolak", color: "red" },
];
