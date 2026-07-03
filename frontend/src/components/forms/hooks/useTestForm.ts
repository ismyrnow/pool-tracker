import { useState } from "react";
import { toDatetimeLocal } from "@/lib/formatters";
import type { TestLog, KitType } from "@/lib/types";

const PARAM_KEYS = [
  "free_chlorine",
  "combined_chlorine",
  "ph",
  "alkalinity",
  "calcium_hardness",
  "cya",
] as const;

function toVals(entry?: TestLog): Record<string, string> {
  if (!entry) return {};
  const out: Record<string, string> = {};
  for (const k of PARAM_KEYS) {
    const v = entry[k];
    if (v !== null && v !== undefined) out[k] = String(v);
  }
  return out;
}

export interface TestFields {
  dt: string;
  setDt: (v: string) => void;
  kitType: KitType;
  setKitType: (v: KitType) => void;
  vals: Record<string, string>;
  setVal: (key: string, v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}

/** Form state, validity, and payload shaping for a Test Log — shared by create + edit. */
export function useTestForm(initial?: TestLog) {
  const [dt, setDt] = useState(() => toDatetimeLocal(initial?.logged_at));
  const [kitType, setKitType] = useState<KitType>(initial?.kit_type ?? "drop");
  const [vals, setVals] = useState<Record<string, string>>(() => toVals(initial));
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const setVal = (key: string, v: string) => setVals((s) => ({ ...s, [key]: v }));

  function reset(entry?: TestLog) {
    setDt(toDatetimeLocal(entry?.logged_at));
    setKitType(entry?.kit_type ?? "drop");
    setVals(toVals(entry));
    setNotes(entry?.notes ?? "");
  }

  const isValid = Object.values(vals).some((v) => !!v);

  function toPayload() {
    return {
      logged_at: new Date(dt).toISOString(),
      kit_type: kitType,
      free_chlorine: vals.free_chlorine ? Number(vals.free_chlorine) : null,
      combined_chlorine: vals.combined_chlorine ? Number(vals.combined_chlorine) : null,
      ph: vals.ph ? Number(vals.ph) : null,
      alkalinity: vals.alkalinity ? Number(vals.alkalinity) : null,
      calcium_hardness: vals.calcium_hardness ? Number(vals.calcium_hardness) : null,
      cya: vals.cya ? Number(vals.cya) : null,
      notes: notes.trim() || null,
    };
  }

  const fields: TestFields = { dt, setDt, kitType, setKitType, vals, setVal, notes, setNotes };

  return { fields, isValid, toPayload, reset };
}
