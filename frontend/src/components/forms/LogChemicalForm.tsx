import { useState, useEffect } from "react";
import { X, Droplet } from "lucide-react";
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
import { useSettings } from "@/hooks/useSettings";
import { toDatetimeLocal } from "@/lib/formatters";
import type { Unit } from "@/lib/types";

const UNIT_SEGMENTS = [
  { value: "oz" as Unit, label: "oz" },
  { value: "lbs" as Unit, label: "lbs" },
  { value: "gal" as Unit, label: "gal" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function LogChemicalForm({ open, onClose, onSaved }: Props) {
  const { settings } = useSettings();
  const options = settings
    ? settings.chemical_options
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const [dt, setDt] = useState(toDatetimeLocal());
  const [chemical, setChemical] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<Unit>("oz");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDt(toDatetimeLocal());
      setChemical(options[0] ?? "");
      setAmount("");
      setUnit("oz");
      setNotes("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSave() {
    if (!chemical || !amount) return;
    setSaving(true);
    try {
      await api.post("/api/chemicals", {
        logged_at: new Date(dt).toISOString(),
        chemical,
        amount: Number(amount),
        unit,
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
              Log Chemicals
            </DrawerTitle>
            <DrawerDescription>Record a chemical addition</DrawerDescription>
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
            <Label>Chemical</Label>
            <div className="grid grid-cols-2 gap-2">
              {options.map((o) => (
                <button
                  key={o}
                  onClick={() => setChemical(o)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-left text-[13.5px] font-semibold leading-tight transition-all border ${
                    chemical === o
                      ? "border-primary/70 bg-primary/5 text-foreground"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <Droplet
                    size={15}
                    className={`flex-shrink-0 ${chemical === o ? "text-primary" : "text-muted-foreground/50"}`}
                  />
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Amount</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
              <SegmentedControl segments={UNIT_SEGMENTS} value={unit} onChange={setUnit} />
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
            disabled={saving || !chemical || !amount}
          >
            {saving ? "Saving…" : "Save Chemicals"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
