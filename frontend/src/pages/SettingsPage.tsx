import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { usePool } from "@/hooks/usePool";
import { useSettings } from "@/hooks/useSettings";
import type { PoolType } from "@/lib/types";

type EditField = "poolName" | "gallons" | "poolType" | "chemStr" | "maintStr" | null;

const POOL_TYPE_SEGMENTS = [
  { value: "chlorine" as PoolType, label: "Chlorine" },
  { value: "salt" as PoolType, label: "Salt" },
];

interface RowProps {
  label: string;
  displayValue: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  multiline?: boolean;
  children: React.ReactNode;
}

function SettingRow({
  label,
  displayValue,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  saving,
  children,
}: RowProps) {
  return (
    <div className="py-3.5 flex flex-col gap-2">
      {isEditing ? (
        <>
          <p className="text-[12px] font-semibold text-muted-foreground">{label}</p>
          {children}
          <div className="flex items-center gap-3 mt-0.5">
            <Button size="sm" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <button onClick={onCancel} className="text-[14px] font-semibold text-foreground">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-muted-foreground">{label}</p>
            <p className="text-[15px] font-semibold mt-0.5">{displayValue}</p>
          </div>
          <button
            onClick={onEdit}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-muted-foreground"
          >
            <Pencil size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { pool, update: updatePool } = usePool();
  const { settings, update: updateSettings } = useSettings();

  const [poolName, setPoolName] = useState("");
  const [gallons, setGallons] = useState("");
  const [poolType, setPoolType] = useState<PoolType>("chlorine");
  const [chemStr, setChemStr] = useState("");
  const [maintStr, setMaintStr] = useState("");

  const [editField, setEditField] = useState<EditField>(null);
  const [draft, setDraft] = useState("");
  const [draftPoolType, setDraftPoolType] = useState<PoolType>("chlorine");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pool) {
      setPoolName(pool.name);
      setGallons(String(pool.gallons));
      setPoolType(pool.pool_type);
    }
  }, [pool]);

  useEffect(() => {
    if (settings) {
      setChemStr(settings.chemical_options);
      setMaintStr(settings.maintenance_activities);
    }
  }, [settings]);

  function startEdit(field: EditField) {
    setEditField(field);
    if (field === "poolName") setDraft(poolName);
    else if (field === "gallons") setDraft(gallons);
    else if (field === "poolType") setDraftPoolType(poolType);
    else if (field === "chemStr") setDraft(chemStr);
    else if (field === "maintStr") setDraft(maintStr);
  }

  function cancelEdit() {
    setEditField(null);
  }

  async function saveField() {
    if (!pool || !settings) return;
    setSaving(true);
    try {
      if (editField === "poolName") {
        await updatePool({ name: draft, gallons: pool.gallons, pool_type: pool.pool_type });
        setPoolName(draft);
      } else if (editField === "gallons") {
        await updatePool({ name: pool.name, gallons: Number(draft), pool_type: pool.pool_type });
        setGallons(draft);
      } else if (editField === "poolType") {
        await updatePool({ name: pool.name, gallons: pool.gallons, pool_type: draftPoolType });
        setPoolType(draftPoolType);
      } else if (editField === "chemStr") {
        await updateSettings({
          chemical_options: draft,
          maintenance_activities: settings.maintenance_activities,
        });
        setChemStr(draft);
      } else if (editField === "maintStr") {
        await updateSettings({
          chemical_options: settings.chemical_options,
          maintenance_activities: draft,
        });
        setMaintStr(draft);
      }
      setEditField(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
    navigate("/login");
  }

  const rowProps = { onSave: saveField, onCancel: cancelEdit, saving };

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader title="Settings" />

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-8 flex flex-col gap-5">
        {/* Pool Profile */}
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
            Pool Profile
          </p>
          <Card className="py-0">
            <div className="px-[14px] divide-y divide-border">
              <SettingRow
                {...rowProps}
                label="Pool name"
                displayValue={poolName}
                isEditing={editField === "poolName"}
                onEdit={() => startEdit("poolName")}
              >
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="h-[42px]"
                  autoFocus
                />
              </SettingRow>

              <SettingRow
                {...rowProps}
                label="Volume"
                displayValue={`${Number(gallons).toLocaleString()} gal`}
                isEditing={editField === "gallons"}
                onEdit={() => startEdit("gallons")}
              >
                <Input
                  type="number"
                  inputMode="numeric"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="h-[42px]"
                  autoFocus
                />
              </SettingRow>

              <SettingRow
                {...rowProps}
                label="Pool type"
                displayValue={poolType === "chlorine" ? "Chlorine" : "Salt"}
                isEditing={editField === "poolType"}
                onEdit={() => startEdit("poolType")}
              >
                <SegmentedControl
                  segments={POOL_TYPE_SEGMENTS}
                  value={draftPoolType}
                  onChange={setDraftPoolType}
                  className="w-full"
                />
              </SettingRow>
            </div>
          </Card>
        </div>

        {/* Customization */}
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
            Customization
          </p>
          <Card className="py-0">
            <div className="px-[14px] divide-y divide-border">
              <SettingRow
                {...rowProps}
                multiline
                label="Chemical Options"
                displayValue={chemStr
                  .split(",")
                  .map((s) => s.trim())
                  .join(", ")}
                isEditing={editField === "chemStr"}
                onEdit={() => startEdit("chemStr")}
              >
                <>
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">Separate items with commas.</p>
                </>
              </SettingRow>

              <SettingRow
                {...rowProps}
                multiline
                label="Maintenance Activities"
                displayValue={maintStr
                  .split(",")
                  .map((s) => s.trim())
                  .join(", ")}
                isEditing={editField === "maintStr"}
                onEdit={() => startEdit("maintStr")}
              >
                <>
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">Separate items with commas.</p>
                </>
              </SettingRow>
            </div>
          </Card>
        </div>

        <Button variant="outline" className="w-full h-[42px]" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
