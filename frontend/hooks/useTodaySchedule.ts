import { useState, useEffect, useCallback, useRef } from "react";
import { useDemo } from "@/contexts/DemoContext";
import type { TodayScheduleStatus } from "@/types/dashboard";
import { fetchTodaySchedule } from "@/lib/schedule-api";

export function useTodaySchedule() {
  const { isDemo } = useDemo();
  const [data, setData] = useState<TodayScheduleStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (isDemo) {
      // Demo mode: always show as working day
      setData({
        is_working_day: true,
        shift_name: "Shift Reguler",
        clock_in_start: "07:30:00",
        clock_in_end: "08:30:00",
        clock_out_start: "16:00:00",
        clock_out_end: "17:00:00",
      });
      setLoading(false);
      return;
    }

    const id = ++fetchRef.current;
    setLoading(true);
    setError(null);

    fetchTodaySchedule()
      .then((res) => {
        if (id === fetchRef.current) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error
              ? err.message
              : "Gagal memuat jadwal hari ini";
          setError(message);
          setLoading(false);
        }
      });
  }, [isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
