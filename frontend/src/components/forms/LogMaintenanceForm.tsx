import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";
import { useSettings } from "@/hooks/useSettings";
import { toDatetimeLocal } from "@/lib/formatters";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function LogMaintenanceForm({ open, onClose, onSaved }: Props) {
  const { settings } = useSettings();
  const activities = settings
    ? settings.maintenance_activities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const [dt, setDt] = useState(toDatetimeLocal());
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDt(toDatetimeLocal());
      setChecked({});
      setNotes("");
    }
  }, [open]);

  const selected = activities.filter((a) => checked[a]);

  async function handleSave() {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      await api.post("/api/maintenance", {
        logged_at: new Date(dt).toISOString(),
        activities: selected,
        notes: notes.trim() || null,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent>
        {/* Header */}
        <div className="px-4 pt-4 pb-0 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <DrawerTitle className="text-[20px] font-bold leading-tight text-left">
              Log Maintenance
            </DrawerTitle>
            <DrawerDescription>Record a maintenance session</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button className="mt-0.5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
              <X size={15} />
            </button>
          </DrawerClose>
        </div>

        {/* Body */}
        <div className="px-4 pt-4 pb-8 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <Label>Date & time</Label>
            <Input
              type="datetime-local"
              value={dt}
              onChange={(e) => setDt(e.target.value)}
              className="h-[42px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Activities</Label>
            <div className="flex flex-col gap-2">
              {activities.map((a) => (
                <label
                  key={a}
                  htmlFor={`activity-${a}`}
                  className={`flex items-center gap-3 px-4 h-[42px] rounded-xl border cursor-pointer transition-colors ${
                    checked[a] ? "border-primary/70 bg-primary/5" : "border-border bg-background"
                  }`}
                >
                  <Checkbox
                    id={`activity-${a}`}
                    checked={!!checked[a]}
                    onCheckedChange={(v) => setChecked((s) => ({ ...s, [a]: !!v }))}
                  />
                  <span className="text-[15px] font-semibold">{a}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>
              Notes <span className="text-muted-foreground font-normal">· optional</span>
            </Label>
            <Textarea
              placeholder="Anything worth remembering…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button
            className="w-full h-[52px] text-[16px]"
            onClick={handleSave}
            disabled={saving || selected.length === 0}
          >
            {saving ? "Saving…" : "Save Maintenance"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
