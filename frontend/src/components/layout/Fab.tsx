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

/**
 * Center speed-dial for the bottom nav. The `+` button sits in-flow within the
 * nav's center cell; its options fan upward above it. Positioning is owned here
 * relative to the nav cell — it no longer floats over page content.
 */
export function Fab({ open, setOpen, onPick }: Props) {
  return (
    <div className="relative flex justify-center">
      {open && (
        <div className="absolute bottom-full mb-3 z-50 flex flex-col items-center gap-2.5">
          {OPTIONS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => onPick(key)}
              className="flex items-center gap-2.5 h-11 pl-4 pr-1.5 rounded-full bg-background shadow-md border border-border whitespace-nowrap animate-in slide-in-from-bottom-2 fade-in duration-200"
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
        aria-label="Add log"
        className={cn(
          "relative z-50 w-14 h-14 rounded-full grid place-items-center bg-primary text-primary-foreground shadow-lg transition-transform duration-200",
          open && "rotate-45",
        )}
      >
        <Plus size={26} strokeWidth={2.4} />
      </button>
    </div>
  );
}
