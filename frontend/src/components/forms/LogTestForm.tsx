import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toDatetimeLocal } from "@/lib/formatters";
import type { TestLog, KitType } from "@/lib/types";

const PARAMS: { key: keyof TestLog; label: string; unit: string }[] = [
  { key: "free_chlorine", label: "Free Cl", unit: "ppm" },
  { key: "combined_chlorine", label: "Combined Cl", unit: "ppm" },
  { key: "ph", label: "pH", unit: "" },
  { key: "alkalinity", label: "Alkalinity", unit: "ppm" },
  { key: "calcium_hardness", label: "Calcium Hardness", unit: "ppm" },
  { key: "cya", label: "CYA", unit: "ppm" },
];

const KIT_SEGMENTS = [
  { value: "drop" as KitType, label: "Drop Kit" },
  { value: "strip" as KitType, label: "Test Strip" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function LogTestForm({ open, onClose, onSaved }: Props) {
  const [dt, setDt] = useState(toDatetimeLocal());
  const [kitType, setKitType] = useState<KitType>("drop");
  const [vals, setVals] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDt(toDatetimeLocal());
      setKitType("drop");
      setVals({});
      setNotes("");
    }
  }, [open]);

  async function handleSave() {
    setSaving(true);
    try {
      await api.post("/api/tests", {
        logged_at: new Date(dt).toISOString(),
        kit_type: kitType,
        free_chlorine: vals.free_chlorine ? Number(vals.free_chlorine) : null,
        combined_chlorine: vals.combined_chlorine ? Number(vals.combined_chlorine) : null,
        ph: vals.ph ? Number(vals.ph) : null,
        alkalinity: vals.alkalinity ? Number(vals.alkalinity) : null,
        calcium_hardness: vals.calcium_hardness ? Number(vals.calcium_hardness) : null,
        cya: vals.cya ? Number(vals.cya) : null,
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
              Log Test Results
            </DrawerTitle>
            <DrawerDescription>Record a water chemistry test</DrawerDescription>
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

          <div className="flex flex-col gap-1.5">
            <Label>Test kit</Label>
            <SegmentedControl
              segments={KIT_SEGMENTS}
              value={kitType}
              onChange={setKitType}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {PARAMS.map(({ key, label, unit }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <Label className="text-[12.5px]">
                  {label}
                  {unit && <span className="text-muted-foreground font-normal"> ({unit})</span>}
                </Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="—"
                  value={vals[key] ?? ""}
                  onChange={(e) => setVals((v) => ({ ...v, [key]: e.target.value }))}
                  className="h-11"
                />
              </div>
            ))}
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
            disabled={saving || Object.values(vals).every((v) => !v)}
          >
            {saving ? "Saving…" : "Save Test Results"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
