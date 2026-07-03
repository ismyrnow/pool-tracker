import { Droplet } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Unit } from "@/lib/types";
import type { ChemicalFields as ChemicalFieldsProps } from "@/components/forms/hooks/useChemicalForm";

const UNIT_SEGMENTS = [
  { value: "oz" as Unit, label: "oz" },
  { value: "lbs" as Unit, label: "lbs" },
  { value: "gal" as Unit, label: "gal" },
];

export function ChemicalFields({
  options,
  dt,
  setDt,
  chemical,
  setChemical,
  amount,
  setAmount,
  unit,
  setUnit,
  notes,
  setNotes,
}: ChemicalFieldsProps) {
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
    </>
  );
}
