import { SegmentedControl } from "@/components/ui/segmented-control";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TestLog, KitType } from "@/lib/types";
import type { TestFields as TestFieldsProps } from "@/components/forms/hooks/useTestForm";

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

export function TestFields({
  dt,
  setDt,
  kitType,
  setKitType,
  vals,
  setVal,
  notes,
  setNotes,
}: TestFieldsProps) {
  return (
    <>
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
              onChange={(e) => setVal(key as string, e.target.value)}
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
    </>
  );
}
