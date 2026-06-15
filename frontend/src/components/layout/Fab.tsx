import { Plus, FlaskConical, Droplets, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type FabAction = "test" | "chem" | "maint";

const OPTIONS: { key: FabAction; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "test", label: "Test Results", Icon: FlaskConical },
  { key: "chem", label: "Chemicals", Icon: Droplets },
  { key: "maint", label: "Maintenance", Icon: Sparkles },
];

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onPick: (action: FabAction) => void;
}

export function Fab({ open, setOpen, onPick }: Props) {
  return (
    <div className="absolute right-[18px] bottom-[calc(86px+env(safe-area-inset-bottom))] z-50 flex flex-col items-end gap-3 pointer-events-none">
      {open && (
        <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
          {OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => onPick(key)}
              className="flex items-center gap-2.5 h-11 pl-4 pr-1.5 rounded-full bg-background shadow-md border border-border animate-in slide-in-from-bottom-2 fade-in duration-200"
            >
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="w-8 h-8 rounded-full grid place-items-center bg-secondary text-primary">
                <Icon size={17} />
              </span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-14 h-14 rounded-full grid place-items-center bg-primary text-primary-foreground shadow-lg pointer-events-auto transition-transform duration-200",
          open && "rotate-45",
        )}
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>
    </div>
  );
}
