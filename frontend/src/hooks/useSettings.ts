import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { UserSettings } from "@/lib/types";

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api
      .get<UserSettings>("/api/settings")
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const update = useCallback(async (data: UserSettings) => {
    const updated = await api.put<UserSettings>("/api/settings", data);
    setSettings(updated);
    return updated;
  }, []);

  return { settings, loading, update };
}
