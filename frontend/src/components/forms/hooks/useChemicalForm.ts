import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { toDatetimeLocal } from "@/lib/formatters";
import type { ChemicalLog, Unit } from "@/lib/types";

export interface ChemicalFields {
  options: string[];
  dt: string;
  setDt: (v: string) => void;
  chemical: string;
  setChemical: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  unit: Unit;
  setUnit: (v: Unit) => void;
  notes: string;
  setNotes: (v: string) => void;
}

/** Form state, validity, and payload shaping for a Chemical Log — shared by create + edit. */
export function useChemicalForm(initial?: ChemicalLog) {
  const { settings } = useSettings();
  const options = settings
    ? settings.chemical_options
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const [dt, setDt] = useState(() => toDatetimeLocal(initial?.logged_at));
  const [chemical, setChemical] = useState(initial?.chemical ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [unit, setUnit] = useState<Unit>(initial?.unit ?? "oz");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function reset(entry?: ChemicalLog) {
    setDt(toDatetimeLocal(entry?.logged_at));
    setChemical(entry?.chemical ?? options[0] ?? "");
    setAmount(entry ? String(entry.amount) : "");
    setUnit(entry?.unit ?? "oz");
    setNotes(entry?.notes ?? "");
  }

  const isValid = !!chemical && !!amount;

  function toPayload() {
    return {
      logged_at: new Date(dt).toISOString(),
      chemical,
      amount: Number(amount),
      unit,
      notes: notes.trim() || null,
    };
  }

  const fields: ChemicalFields = {
    options,
    dt,
    setDt,
    chemical,
    setChemical,
    amount,
    setAmount,
    unit,
    setUnit,
    notes,
    setNotes,
  };

  return { fields, isValid, toPayload, reset };
}
