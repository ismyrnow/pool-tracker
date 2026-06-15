import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { fmtDate, daysAgo } from "@/lib/formatters";
import type { MaintenanceLog } from "@/lib/types";

export function MaintenanceSummary({ log }: { log: MaintenanceLog }) {
  return (
    <Card className="py-0">
      <div className="p-[14px]">
        <div className="flex items-center gap-3">
          <span className="w-[38px] h-[38px] rounded-[11px] flex-shrink-0 grid place-items-center bg-secondary text-foreground">
            <Sparkles size={19} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[14.5px] font-semibold tracking-tight truncate">
              {log.activities.join(" · ")}
            </p>
            <p className="text-[12.5px] text-muted-foreground mt-0.5">{fmtDate(log.logged_at)}</p>
          </div>
          <span className="text-[12.5px] font-semibold text-muted-foreground flex-shrink-0">
            {daysAgo(log.logged_at)}
          </span>
        </div>
        {log.notes && (
          <p className="text-[12.5px] text-muted-foreground mt-2.5 pt-2.5 border-t border-border leading-snug">
            {log.notes}
          </p>
        )}
      </div>
    </Card>
  );
}
