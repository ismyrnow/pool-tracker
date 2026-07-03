import { Droplet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { fmtDate, fmtTime } from "@/lib/formatters";
import type { ChemicalLog } from "@/lib/types";

export function ChemicalLogItem({ log }: { log: ChemicalLog }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(`/chemicals/${log.id}/edit`, { state: { entry: log } })}
      className="w-full text-left transition-opacity active:opacity-60"
    >
      <Card className="py-0">
        <div className="py-[13px] px-[15px] flex items-center gap-3">
          <span className="w-[38px] h-[38px] rounded-[11px] flex-shrink-0 grid place-items-center bg-secondary text-foreground">
            <Droplet size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] text-muted-foreground">
              {fmtDate(log.logged_at)} · {fmtTime(log.logged_at)}
            </p>
            <p className="text-[15px] font-semibold mt-0.5 tracking-tight">{log.chemical}</p>
          </div>
          <div className="text-[15px] font-bold tracking-tight flex-shrink-0">
            {log.amount}
            <span className="text-[12.5px] font-semibold text-muted-foreground ml-0.5">
              {log.unit}
            </span>
          </div>
        </div>
      </Card>
    </button>
  );
}
