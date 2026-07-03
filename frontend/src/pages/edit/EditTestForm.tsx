import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { EditLogScreen } from "@/components/forms/EditLogScreen";
import { TestFields } from "@/components/forms/fields/TestFields";
import { useTestForm } from "@/components/forms/hooks/useTestForm";
import { api } from "@/lib/api";
import type { TestLog } from "@/lib/types";

export function EditTestForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const entry = (state as { entry?: TestLog } | null)?.entry;

  const { fields, isValid, toPayload } = useTestForm(entry);
  const [saving, setSaving] = useState(false);

  if (!entry) return <Navigate to="/history" replace />;

  async function handleSave() {
    setSaving(true);
    try {
      await api.put(`/api/tests/${entry!.id}`, toPayload());
      navigate(-1);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await api.delete(`/api/tests/${entry!.id}`);
    navigate(-1);
  }

  return (
    <EditLogScreen
      title="Edit Test Results"
      logLabel="test log"
      saving={saving}
      canSave={isValid}
      onSave={handleSave}
      onDelete={handleDelete}
    >
      <TestFields {...fields} />
    </EditLogScreen>
  );
}
