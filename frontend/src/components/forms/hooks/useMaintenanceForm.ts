import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { toDatetimeLocal } from "@/lib/formatters";
import type { MaintenanceLog } from "@/lib/types";

function toChecked(entry?: MaintenanceLog): Record<string, boolean> {
  if (!entry) return {};
  return Object.fromEntries(entry.activities.map((a) => [a, true]));
}

export interface MaintenanceFields {
  activities: string[];
  dt: string;
  setDt: (v: string) => void;
  checked: Record<string, boolean>;
  toggle: (activity: string, v: boolean) => void;
  notes: string;
  setNotes: (v: string) => void;
}

/** Form state, validity, and payload shaping for a Maintenance Log — shared by create + edit. */
export function useMaintenanceForm(initial?: MaintenanceLog) {
  const { settings } = useSettings();
  const activities = settings
    ? settings.maintenance_activities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const [dt, setDt] = useState(() => toDatetimeLocal(initial?.logged_at));
  const [checked, setChecked] = useState<Record<string, boolean>>(() => toChecked(initial));
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const toggle = (activity: string, v: boolean) => setChecked((s) => ({ ...s, [activity]: v }));

  function reset(entry?: MaintenanceLog) {
    setDt(toDatetimeLocal(entry?.logged_at));
    setChecked(toChecked(entry));
    setNotes(entry?.notes ?? "");
  }

  const selected = activities.filter((a) => checked[a]);
  const isValid = selected.length > 0;

  function toPayload() {
    return {
      logged_at: new Date(dt).toISOString(),
      activities: selected,
      notes: notes.trim() || null,
    };
  }

  const fields: MaintenanceFields = { activities, dt, setDt, checked, toggle, notes, setNotes };

  return { fields, isValid, toPayload, reset };
}
