import { FlaskConical, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ParameterCard } from "@/components/dashboard/ParameterCard";
import { MaintenanceSummary } from "@/components/dashboard/MaintenanceSummary";
import { useDashboard } from "@/hooks/useDashboard";
import { usePool } from "@/hooks/usePool";
import { fmtDate, fmtTime, fmtGallons, KIT_TYPE_LABEL, POOL_TYPE_LABEL } from "@/lib/formatters";
import { useNavigate, useOutletContext } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();
  const { refreshKey } = useOutletContext<{ refreshKey: number }>();
  const { data } = useDashboard(refreshKey);
  const { pool } = usePool();

  const subtitle = pool
    ? `${pool.name} · ${fmtGallons(pool.gallons)} gal · ${POOL_TYPE_LABEL[pool.pool_type]}`
    : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="px-5 pt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-[28px] font-bold tracking-tight leading-tight">Dashboard</h1>
          {subtitle && <p className="text-[13.5px] text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <button
          onClick={() => navigate("/settings")}
          aria-label="Settings"
          className="mt-1 flex-shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
        >
          <Settings size={18} />
        </button>
      </div>

      {data?.latestTest && (
        <div className="px-5">
          <Card className="py-0 bg-gradient-to-b from-sky-50 to-blue-50 border-blue-100">
            <div className="py-[13px] px-[15px] flex items-center gap-3">
              <span className="w-9 h-9 rounded-[10px] flex-shrink-0 grid place-items-center bg-primary text-primary-foreground shadow-md shadow-primary/40">
                <FlaskConical size={17} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Last tested
                </p>
                <p className="text-[14.5px] font-semibold mt-0.5 tracking-tight">
                  {fmtDate(data.latestTest.logged_at)} · {fmtTime(data.latestTest.logged_at)}
                </p>
              </div>
              <Badge variant="outline" className="font-semibold flex-shrink-0 bg-white">
                {KIT_TYPE_LABEL[data.latestTest.kit_type]}
              </Badge>
            </div>
          </Card>
        </div>
      )}

      <div className="px-5 flex flex-col gap-2.5">
        <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
          Water Chemistry
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {data?.parameters.map((p) => (
            <ParameterCard key={p.parameter} param={p} />
          ))}
        </div>
      </div>

      <div className="px-5 pb-2 flex flex-col gap-2.5">
        <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
          Last Maintenance
        </p>
        {data?.latestMaintenance ? (
          <MaintenanceSummary log={data.latestMaintenance} />
        ) : (
          <Card className="py-0">
            <div className="py-5 text-center text-[13.5px] text-muted-foreground">
              No maintenance logged yet
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
