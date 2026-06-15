export const KIT_TYPE_LABEL: Record<string, string> = {
  drop: "Drop Kit",
  strip: "Test Strip",
};

export const POOL_TYPE_LABEL: Record<string, string> = {
  chlorine: "Chlorine",
  salt: "Salt",
};

export function fmtGallons(n: number): string {
  return n.toLocaleString("en-US");
}

export function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function fmtTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function daysAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export function toDatetimeLocal(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fmtIdealRange(low: number, high: number, unit: string): string {
  const range = low === 0 ? `< ${high}` : `${low}–${high}`;
  return unit ? `${range} ${unit}` : range;
}
