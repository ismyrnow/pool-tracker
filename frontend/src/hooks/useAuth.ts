import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export function useSetupStatus() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .get<{ needsSetup: boolean }>("/api/setup-status")
      .then((data) => setNeedsSetup(data.needsSetup))
      .catch(() => setNeedsSetup(false));
  }, []);

  return needsSetup;
}
