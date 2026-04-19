// ════════════════════════════════════════════
// EMPLOYMENT CONTRACT TYPES
// ════════════════════════════════════════════

export type ContractType =
  | "pkwt"
  | "pkwtt"
  | "probation"
  | "intern"
  | "part_time"
  | "freelance";

export interface EmploymentContract {
  id: number;
  employee_id: number;
  contract_number: string;
  contract_type: ContractType;
  start_date: string;
  end_date: string | null;
  salary: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreateContractPayload {
  contract_number: string;
  contract_type: ContractType;
  start_date: string;
  end_date?: string;
  salary?: number;
  notes?: string;
}

export interface UpdateContractPayload {
  contract_number?: string;
  contract_type?: ContractType;
  start_date?: string;
  end_date?: string;
  salary?: number;
  notes?: string;
}

// Contract type labels for display
export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  pkwt: "PKWT",
  pkwtt: "PKWTT",
  probation: "Probation",
  intern: "Intern",
  part_time: "Part Time",
  freelance: "Freelance",
};

// Contract type colors for badges
export const CONTRACT_TYPE_COLORS: Record<ContractType, string> = {
  pkwt: "bg-blue-100 text-blue-700",
  pkwtt: "bg-green-100 text-green-700",
  probation: "bg-yellow-100 text-yellow-700",
  intern: "bg-purple-100 text-purple-700",
  part_time: "bg-orange-100 text-orange-700",
  freelance: "bg-gray-100 text-gray-700",
};
