import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { MaintenanceFields as MaintenanceFieldsProps } from "@/components/forms/hooks/useMaintenanceForm";

export function MaintenanceFields({
  activities,
  dt,
  setDt,
  checked,
  toggle,
  notes,
  setNotes,
}: MaintenanceFieldsProps) {
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
                onCheckedChange={(v) => toggle(a, !!v)}
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
    </>
  );
}
