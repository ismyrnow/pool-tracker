import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fmtDate, fmtTime, KIT_TYPE_LABEL } from "@/lib/formatters";
import type { TestLog } from "@/lib/types";

const PARAM_KEYS: { key: keyof TestLog; label: string }[] = [
  { key: "free_chlorine", label: "FC" },
  { key: "combined_chlorine", label: "CC" },
  { key: "ph", label: "pH" },
  { key: "alkalinity", label: "ALK" },
  { key: "calcium_hardness", label: "CH" },
  { key: "cya", label: "CYA" },
];

const RANGES: Record<string, { low: number; high: number }> = {
  free_chlorine: { low: 2, high: 4 },
  combined_chlorine: { low: 0, high: 0.5 },
  ph: { low: 7.4, high: 7.6 },
  alkalinity: { low: 80, high: 120 },
  calcium_hardness: { low: 200, high: 400 },
  cya: { low: 30, high: 50 },
};

const DOT: Record<string, string> = {
  good: "bg-green-500",
  low: "bg-amber-500",
  high: "bg-red-500",
  untested: "bg-muted-foreground/30",
};

function getStatus(key: string, value: number | null) {
  if (value === null) return "untested";
  const r = RANGES[key];
  if (key === "combined_chlorine") return value >= r.high ? "high" : "good";
  if (value < r.low) return "low";
  if (value > r.high) return "high";
  return "good";
}

export function TestLogItem({ test }: { test: TestLog }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/tests/${test.id}/edit`, { state: { entry: test } })}
      className="w-full text-left transition-opacity active:opacity-60"
    >
      <Card className="py-0">
        <div className="p-[14px]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14px] font-semibold tracking-tight">
              {fmtDate(test.logged_at)}{" "}
              <span className="text-muted-foreground font-normal">· {fmtTime(test.logged_at)}</span>
            </span>
            <Badge variant="outline" className="text-xs font-semibold">
              {KIT_TYPE_LABEL[test.kit_type]}
            </Badge>
          </div>
          <div className="grid grid-cols-6 gap-1 mt-2.5">
            {PARAM_KEYS.map(({ key, label }) => {
              const v = test[key] as number | null;
              const status = getStatus(key as string, v);
              return (
                <div
                  key={key}
                  className="flex flex-col items-center gap-0.5 py-1.5 rounded-[9px] bg-muted"
                >
                  <span className="text-[8.5px] font-bold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </span>
                  <span className="text-[13px] font-bold tracking-tight">
                    {v !== null ? v : "—"}
                  </span>
                  <span className={`w-[5px] h-[5px] rounded-full ${DOT[status]}`} />
                </div>
              );
            })}
          </div>
          {test.notes && (
            <p className="text-[12.5px] text-muted-foreground mt-2.5 leading-snug">{test.notes}</p>
          )}
        </div>
      </Card>
    </button>
  );
}
