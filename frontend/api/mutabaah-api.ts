import type {
  MutabaahLog,
  MutabaahListParams,
  MutabaahTodayStatus,
  MutabaahSubmitPayload,
  MutabaahCancelPayload,
  MutabaahDailyReport,
  MutabaahMonthlySummary,
  MutabaahCategorySummary,
} from "@/types/mutabaah";
import { apiCall } from "@/lib/api";
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
// MUTABA'AH API (§14)
// ════════════════════════════════════════════

/** GET /mutabaah — List mutabaah logs */
export async function fetchMutabaahLogs(
  params?: MutabaahListParams,
) {
  const query = buildQueryString(params);
  return apiCall<MutabaahLog[]>(`/mutabaah${query}`);
}

/** GET /mutabaah/today — Today's mutabaah status */
export async function fetchMutabaahToday() {
  return apiCall<MutabaahTodayStatus>("/mutabaah/today");
}

/** POST /mutabaah/submit — Submit tilawah hari ini */
export async function submitMutabaah(
  payload: MutabaahSubmitPayload,
) {
  return apiCall<MutabaahLog>("/mutabaah/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /mutabaah/cancel — Cancel tilawah */
export async function cancelMutabaah(
  payload: MutabaahCancelPayload,
) {
  return apiCall<MutabaahLog>("/mutabaah/cancel", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** GET /mutabaah/report/daily — Laporan harian */
export async function fetchMutabaahDailyReport(date: string) {
  return apiCall<MutabaahDailyReport[]>(
    `/mutabaah/report/daily?date=${date}`,
  );
}

/** GET /mutabaah/report/monthly — Laporan bulanan */
export async function fetchMutabaahMonthlyReport(
  month: number,
  year: number,
) {
  return apiCall<MutabaahMonthlySummary[]>(
    `/mutabaah/report/monthly?month=${month}&year=${year}`,
  );
}

/** GET /mutabaah/report/category — Perbandingan kategori */
export async function fetchMutabaahCategoryReport(
  date: string,
) {
  return apiCall<MutabaahCategorySummary[]>(
    `/mutabaah/report/category?date=${date}`,
  );
}
