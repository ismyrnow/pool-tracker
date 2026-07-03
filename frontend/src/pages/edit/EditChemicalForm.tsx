import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { EditLogScreen } from "@/components/forms/EditLogScreen";
import { ChemicalFields } from "@/components/forms/fields/ChemicalFields";
import { useChemicalForm } from "@/components/forms/hooks/useChemicalForm";
import { api } from "@/lib/api";
import type { ChemicalLog } from "@/lib/types";

export function EditChemicalForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const entry = (state as { entry?: ChemicalLog } | null)?.entry;

  const { fields, isValid, toPayload } = useChemicalForm(entry);
  const [saving, setSaving] = useState(false);

  if (!entry) return <Navigate to="/history" replace />;

  async function handleSave() {
    setSaving(true);
    try {
      await api.put(`/api/chemicals/${entry!.id}`, toPayload());
      navigate(-1);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await api.delete(`/api/chemicals/${entry!.id}`);
    navigate(-1);
  }

  return (
    <EditLogScreen
      title="Edit Chemical"
      logLabel="chemical log"
      saving={saving}
      canSave={isValid}
      onSave={handleSave}
      onDelete={handleDelete}
    >
      <ChemicalFields {...fields} />
    </EditLogScreen>
  );
}
