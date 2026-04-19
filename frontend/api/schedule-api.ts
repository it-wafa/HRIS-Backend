import type { TodayScheduleStatus } from "@/types/dashboard";
import { apiCall } from "@/lib/api";

/** GET /schedules/my-today — Cek jadwal kerja hari ini */
export async function fetchTodaySchedule() {
  return apiCall<TodayScheduleStatus>("/schedules/my-today");
}
