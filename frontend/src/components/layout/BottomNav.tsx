import { Home, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fab, type FabAction } from "./Fab";

const ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: Home },
  { key: "history", label: "History", Icon: Clock },
] as const;

type Tab = (typeof ITEMS)[number]["key"];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  fabOpen: boolean;
  setFabOpen: (open: boolean) => void;
  onPick: (action: FabAction) => void;
}

export function BottomNav({ active, onChange, fabOpen, setFabOpen, onPick }: Props) {
  return (
    <div className="relative flex-shrink-0 grid grid-cols-3 items-center px-3 pb-[calc(6px+env(safe-area-inset-bottom))] pt-1 bg-background/90 backdrop-blur border-t border-border">
      <NavTab
        item={ITEMS[0]}
        active={active === ITEMS[0].key}
        onClick={() => onChange(ITEMS[0].key)}
      />

      {/* Spacer for the elevated FAB, which is absolutely positioned so the bar stays short */}
      <span aria-hidden />

      <NavTab
        item={ITEMS[1]}
        active={active === ITEMS[1].key}
        onClick={() => onChange(ITEMS[1].key)}
      />

      {/* Center FAB, lifted above the nav's top edge */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <Fab open={fabOpen} setOpen={setFabOpen} onPick={onPick} />
      </div>
    </div>
  );
}

function NavTab({
  item,
  active,
  onClick,
}: {
  item: (typeof ITEMS)[number];
  active: boolean;
  onClick: () => void;
}) {
  const { label, Icon } = item;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 py-1 transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon size={22} strokeWidth={active ? 2.4 : 2} />
      <span className={cn("text-[11px] leading-none", active ? "font-bold" : "font-medium")}>
        {label}
      </span>
    </button>
  );
}
