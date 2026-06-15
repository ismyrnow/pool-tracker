import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fmtDate, fmtTime, daysAgo } from "@/lib/formatters";
import type { MaintenanceLog } from "@/lib/types";

export function MaintenanceLogItem({ log }: { log: MaintenanceLog }) {
  return (
    <Card className="py-0">
      <div className="p-[14px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-semibold tracking-tight">
            {fmtDate(log.logged_at)}{" "}
            <span className="text-muted-foreground font-normal">· {fmtTime(log.logged_at)}</span>
          </span>
          <span className="text-[12px] font-semibold text-muted-foreground flex-shrink-0">
            {daysAgo(log.logged_at)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {log.activities.map((a) => (
            <Badge key={a} variant="secondary">
              {a}
            </Badge>
          ))}
        </div>
        {log.notes && (
          <p className="text-[12.5px] text-muted-foreground mt-2.5 leading-snug">{log.notes}</p>
        )}
      </div>
    </Card>
  );
}
