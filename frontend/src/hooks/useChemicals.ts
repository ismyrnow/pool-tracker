import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { ChemicalLog } from "@/lib/types";

export function useChemicals(days = 90) {
  const [chemicals, setChemicals] = useState<ChemicalLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api
      .get<ChemicalLog[]>(`/api/chemicals?days=${days}`)
      .then(setChemicals)
      .finally(() => setLoading(false));
  }, [days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = useCallback(async (data: Omit<ChemicalLog, "id" | "created_at">) => {
    const created = await api.post<ChemicalLog>("/api/chemicals", data);
    setChemicals((prev) =>
      [created, ...prev].sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime(),
      ),
    );
    return created;
  }, []);

  const remove = useCallback(async (id: number) => {
    await api.delete(`/api/chemicals/${id}`);
    setChemicals((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { chemicals, loading, create, remove, refetch: fetch };
}
