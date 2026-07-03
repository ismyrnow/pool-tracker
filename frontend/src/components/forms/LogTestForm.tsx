import { useState, useEffect } from "react";
import { LogFormDrawer } from "@/components/forms/LogFormDrawer";
import { TestFields } from "@/components/forms/fields/TestFields";
import { useTestForm } from "@/components/forms/hooks/useTestForm";
import { api } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function LogTestForm({ open, onClose, onSaved }: Props) {
  const { fields, isValid, toPayload, reset } = useTestForm();
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
      await api.post("/api/tests", toPayload());
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <LogFormDrawer
      open={open}
      onClose={onClose}
      title="Log Test Results"
      description="Record a water chemistry test"
      submitLabel="Save Test Results"
      saving={saving}
      canSave={isValid}
      onSubmit={handleSave}
    >
      <TestFields {...fields} />
    </LogFormDrawer>
  );
}
