import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { MaintenanceLog } from "@/lib/types";

export function useMaintenance(days = 90) {
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api
      .get<MaintenanceLog[]>(`/api/maintenance?days=${days}`)
      .then(setMaintenance)
      .finally(() => setLoading(false));
  }, [days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = useCallback(async (data: Omit<MaintenanceLog, "id" | "created_at">) => {
    const created = await api.post<MaintenanceLog>("/api/maintenance", data);
    setMaintenance((prev) =>
      [created, ...prev].sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime(),
      ),
    );
    return created;
  }, []);

  const remove = useCallback(async (id: number) => {
    await api.delete(`/api/maintenance/${id}`);
    setMaintenance((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { maintenance, loading, create, remove, refetch: fetch };
}
