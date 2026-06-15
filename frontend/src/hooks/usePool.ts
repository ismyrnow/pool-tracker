import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { PoolProfile } from "@/lib/types";

export function usePool() {
  const [pool, setPool] = useState<PoolProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api
      .get<PoolProfile>("/api/pool")
      .then(setPool)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const update = useCallback(async (data: Partial<PoolProfile>) => {
    const updated = await api.put<PoolProfile>("/api/pool", data);
    setPool(updated);
    return updated;
  }, []);

  return { pool, loading, update, refetch: fetch };
}
