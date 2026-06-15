import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ChemistryChart } from "@/components/history/ChemistryChart";
import { TestLogItem } from "@/components/history/TestLogItem";
import { ChemicalLogItem } from "@/components/history/ChemicalLogItem";
import { MaintenanceLogItem } from "@/components/history/MaintenanceLogItem";
import { useTests } from "@/hooks/useTests";
import { useChemicals } from "@/hooks/useChemicals";
import { useMaintenance } from "@/hooks/useMaintenance";
import { fmtIdealRange } from "@/lib/formatters";
import type { TestLog } from "@/lib/types";

const METRICS: {
  key: keyof TestLog;
  label: string;
  unit: string;
  idealLow: number;
  idealHigh: number;
}[] = [
  { key: "free_chlorine", label: "Free Chlorine", unit: "ppm", idealLow: 2, idealHigh: 4 },
  {
    key: "combined_chlorine",
    label: "Combined Chlorine",
    unit: "ppm",
    idealLow: 0,
    idealHigh: 0.5,
  },
  { key: "ph", label: "pH", unit: "", idealLow: 7.4, idealHigh: 7.6 },
  { key: "alkalinity", label: "Alkalinity", unit: "ppm", idealLow: 80, idealHigh: 120 },
  {
    key: "calcium_hardness",
    label: "Calcium Hardness",
    unit: "ppm",
    idealLow: 200,
    idealHigh: 400,
  },
  { key: "cya", label: "CYA", unit: "ppm", idealLow: 30, idealHigh: 50 },
];

const RANGE_SEGMENTS = [
  { value: 30 as const, label: "30d" },
  { value: 90 as const, label: "90d" },
];

const TAB_SEGMENTS = [
  { value: "tests" as const, label: "Test Results" },
  { value: "chems" as const, label: "Chemicals" },
  { value: "maint" as const, label: "Maintenance" },
];

type Tab = (typeof TAB_SEGMENTS)[number]["value"];

function TestResultsTab() {
  const [metricKey, setMetricKey] = useState<keyof TestLog>("free_chlorine");
  const [rangeDays, setRangeDays] = useState<30 | 90>(90);
  const { tests } = useTests(rangeDays);

  const metric = METRICS.find((m) => m.key === metricKey)!;

  const chartData = useMemo(
    () =>
      tests
        .filter((t) => t[metricKey] !== null)
        .map((t) => ({
          date: new Date(t.logged_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          value: t[metricKey] as number,
        }))
        .reverse(),
    [tests, metricKey],
  );

  return (
    <div className="flex flex-col gap-3.5">
      <Card className="py-0">
        <div className="p-[14px]">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="flex-1">
              <Select value={metricKey} onValueChange={(v) => setMetricKey(v as keyof TestLog)}>
                <SelectTrigger className="w-full">
                  <SelectValue>{metric.label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {METRICS.map((m) => (
                    <SelectItem key={m.key} value={m.key}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SegmentedControl segments={RANGE_SEGMENTS} value={rangeDays} onChange={setRangeDays} />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[12.5px] font-semibold text-muted-foreground">
              Ideal {fmtIdealRange(metric.idealLow, metric.idealHigh, metric.unit)}
            </span>
            <span className="ml-auto flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
              <span className="w-3.5 h-2 rounded-sm bg-green-100 border border-green-300" />
              ideal range
            </span>
          </div>
          <ChemistryChart
            data={chartData}
            idealLow={metric.idealLow}
            idealHigh={metric.idealHigh}
            unit={metric.unit}
          />
        </div>
      </Card>

      <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
        {tests.length} Test{tests.length === 1 ? "" : "s"}
      </p>
      {tests.map((t) => (
        <TestLogItem key={t.id} test={t} />
      ))}
    </div>
  );
}

function ChemicalsTab() {
  const { chemicals } = useChemicals(90);
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
        {chemicals.length} Addition{chemicals.length === 1 ? "" : "s"}
      </p>
      {chemicals.map((c) => (
        <ChemicalLogItem key={c.id} log={c} />
      ))}
    </div>
  );
}

function MaintenanceTab() {
  const { maintenance } = useMaintenance(90);
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">
        {maintenance.length} Session{maintenance.length === 1 ? "" : "s"}
      </p>
      {maintenance.map((m) => (
        <MaintenanceLogItem key={m.id} log={m} />
      ))}
    </div>
  );
}

export function HistoryPage() {
  const [tab, setTab] = useState<Tab>("tests");

  return (
    <div className="flex flex-col gap-3.5">
      <div className="px-5 pt-2">
        <h1 className="text-[28px] font-bold tracking-tight leading-tight">History</h1>
      </div>

      <div className="px-5 sticky top-0 z-10 bg-background pb-1 pt-0.5">
        <SegmentedControl
          segments={TAB_SEGMENTS}
          value={tab}
          onChange={setTab}
          className="w-full"
        />
      </div>

      <div className="px-5 pb-2">
        {tab === "tests" && <TestResultsTab />}
        {tab === "chems" && <ChemicalsTab />}
        {tab === "maint" && <MaintenanceTab />}
      </div>
    </div>
  );
}
