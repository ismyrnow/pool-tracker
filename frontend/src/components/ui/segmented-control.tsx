import { cn } from "@/lib/utils";

interface Segment<T extends string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string | number>({
  segments,
  value,
  onChange,
  className,
}: Props<T>) {
  return (
    <div className={cn("inline-flex items-center rounded-lg bg-muted p-[3px] h-9", className)}>
      {segments.map((seg) => (
        <button
          key={seg.value}
          type="button"
          onClick={() => onChange(seg.value)}
          className={cn(
            "relative h-full flex-1 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all",
            seg.value === value
              ? "bg-background text-foreground shadow-sm"
              : "text-foreground/60 hover:text-foreground",
          )}
        >
          {seg.label}
        </button>
      ))}
    </div>
  );
}
