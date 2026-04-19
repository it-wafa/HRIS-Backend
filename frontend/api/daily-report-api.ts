import type {
  DailyReport,
  CreateDailyReportPayload,
  UpdateDailyReportPayload,
  DailyReportListParams,
} from "@/types/daily-report";
import { apiCall } from "@/lib/api";

/** Build query string from params */
function buildQueryString<T extends object>(params?: T): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// ════════════════════════════════════════════
// DAILY REPORT API
// ════════════════════════════════════════════

/** GET /daily-reports — List daily reports */
export async function fetchDailyReports(
  params?: DailyReportListParams,
) {
  const query = buildQueryString(params);
  return apiCall<DailyReport[]>(`/daily-reports${query}`);
}

/** GET /daily-reports/:id — Get daily report by ID */
export async function fetchDailyReportById(id: number) {
  return apiCall<DailyReport>(`/daily-reports/${id}`);
}

/** POST /daily-reports — Create a new daily report */
export async function createDailyReport(
  payload: CreateDailyReportPayload,
) {
  return apiCall<DailyReport>("/daily-reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** PUT /daily-reports/:id — Update a daily report */
export async function updateDailyReport(
  id: number,
  payload: UpdateDailyReportPayload,
) {
  return apiCall<DailyReport>(`/daily-reports/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
