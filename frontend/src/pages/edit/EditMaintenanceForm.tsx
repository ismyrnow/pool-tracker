import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { EditLogScreen } from "@/components/forms/EditLogScreen";
import { MaintenanceFields } from "@/components/forms/fields/MaintenanceFields";
import { useMaintenanceForm } from "@/components/forms/hooks/useMaintenanceForm";
import { api } from "@/lib/api";
import type { MaintenanceLog } from "@/lib/types";

export function EditMaintenanceForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const entry = (state as { entry?: MaintenanceLog } | null)?.entry;

  const { fields, isValid, toPayload } = useMaintenanceForm(entry);
  const [saving, setSaving] = useState(false);

  if (!entry) return <Navigate to="/history" replace />;

  async function handleSave() {
    setSaving(true);
    try {
      await api.put(`/api/maintenance/${entry!.id}`, toPayload());
      navigate(-1);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await api.delete(`/api/maintenance/${entry!.id}`);
    navigate(-1);
  }

  return (
    <EditLogScreen
      title="Edit Maintenance"
      logLabel="maintenance log"
      saving={saving}
      canSave={isValid}
      onSave={handleSave}
      onDelete={handleDelete}
    >
      <MaintenanceFields {...fields} />
    </EditLogScreen>
  );
}
