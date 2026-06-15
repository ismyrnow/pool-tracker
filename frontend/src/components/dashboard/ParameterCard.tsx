import { Card } from "@/components/ui/card";
import { fmtIdealRange } from "@/lib/formatters";
import type { Parameter } from "@/lib/types";

const DOT: Record<string, string> = {
  good: "bg-green-500",
  low: "bg-amber-500",
  high: "bg-red-500",
  untested: "bg-muted-foreground/40",
};

const LABEL: Record<string, string> = {
  good: "Good",
  low: "Low",
  high: "High",
  untested: "No data",
};

export function ParameterCard({ param }: { param: Parameter }) {
  const idealStr = fmtIdealRange(param.idealLow, param.idealHigh, param.unit);

  return (
    <Card className="py-0">
      <div className="p-[14px] flex flex-col gap-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {param.parameter}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[27px] font-bold leading-none tracking-tight">
            {param.value !== null ? param.value : "—"}
          </span>
          {param.unit && (
            <span className="text-[12.5px] font-semibold text-muted-foreground">{param.unit}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold border border-border rounded-full px-2 py-0.5 text-foreground">
            <span
              className={`w-[6px] h-[6px] rounded-full flex-shrink-0 -translate-y-px ${DOT[param.status]}`}
            />
            {LABEL[param.status]}
          </span>
          <span className="text-[11px] text-muted-foreground ml-auto">{idealStr}</span>
        </div>
        {param.recommendation && (
          <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-snug">
            {param.recommendation}
          </p>
        )}
      </div>
    </Card>
  );
}
