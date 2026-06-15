import { Home, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: Home, href: "/" },
  { key: "history", label: "History", Icon: Clock, href: "/history" },
  { key: "settings", label: "Settings", Icon: Settings, href: "/settings" },
] as const;

type Tab = (typeof ITEMS)[number]["key"];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <div className="flex-shrink-0 grid grid-cols-3 px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 bg-background/90 backdrop-blur border-t border-border">
      {ITEMS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex flex-col items-center gap-1 py-1.5 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon size={23} strokeWidth={isActive ? 2.4 : 2} />
            <span
              className={cn("text-[11px] leading-none", isActive ? "font-bold" : "font-medium")}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
