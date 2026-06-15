import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: Array<{ date: string; value: number }>;
  idealLow: number;
  idealHigh: number;
  unit: string;
}

export function ChemistryChart({ data, idealLow, idealHigh, unit }: Props) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <ReferenceArea y1={idealLow} y2={idealHigh} fill="#dcfce7" fillOpacity={0.6} />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v) => [`${v}${unit ? " " + unit : ""}`, "Value"]} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
