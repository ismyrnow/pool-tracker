import { useState, useEffect } from "react";
import { LogFormDrawer } from "@/components/forms/LogFormDrawer";
import { MaintenanceFields } from "@/components/forms/fields/MaintenanceFields";
import { useMaintenanceForm } from "@/components/forms/hooks/useMaintenanceForm";
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function LogMaintenanceForm({ open, onClose, onSaved }: Props) {
  const { fields, isValid, toPayload, reset } = useMaintenanceForm();
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
      await api.post("/api/maintenance", toPayload());
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <LogFormDrawer
      open={open}
      onClose={onClose}
      title="Log Maintenance"
      description="Record a maintenance session"
      submitLabel="Save Maintenance"
      saving={saving}
      canSave={isValid}
      onSubmit={handleSave}
    >
      <MaintenanceFields {...fields} />
    </LogFormDrawer>
  );
}
