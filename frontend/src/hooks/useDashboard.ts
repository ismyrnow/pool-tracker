import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { DashboardData } from "@/lib/types";

export function useDashboard(refreshKey = 0) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api
      .get<DashboardData>("/api/dashboard")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch, refreshKey]);

  return { data, loading, refetch: fetch };
}
