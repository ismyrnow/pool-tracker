import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { TestLog } from "@/lib/types";

export function useTests(days = 90) {
  const [tests, setTests] = useState<TestLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api
      .get<TestLog[]>(`/api/tests?days=${days}`)
      .then(setTests)
      .finally(() => setLoading(false));
  }, [days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = useCallback(async (data: Omit<TestLog, "id" | "created_at">) => {
    const created = await api.post<TestLog>("/api/tests", data);
    setTests((prev) =>
      [created, ...prev].sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime(),
      ),
    );
    return created;
  }, []);

  const remove = useCallback(async (id: number) => {
    await api.delete(`/api/tests/${id}`);
    setTests((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tests, loading, create, remove, refetch: fetch };
}
