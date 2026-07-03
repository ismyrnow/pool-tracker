import { useState, useEffect } from "react";
import { LogFormDrawer } from "@/components/forms/LogFormDrawer";
import { ChemicalFields } from "@/components/forms/fields/ChemicalFields";
import { useChemicalForm } from "@/components/forms/hooks/useChemicalForm";
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function LogChemicalForm({ open, onClose, onSaved }: Props) {
  const { fields, isValid, toPayload, reset } = useChemicalForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      reset();
      setSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.post("/api/chemicals", toPayload());
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <LogFormDrawer
      open={open}
      onClose={onClose}
      title="Log Chemicals"
      description="Record a chemical addition"
      submitLabel="Save Chemicals"
      saving={saving}
      canSave={isValid}
      onSubmit={handleSave}
    >
      <ChemicalFields {...fields} />
    </LogFormDrawer>
  );
}
