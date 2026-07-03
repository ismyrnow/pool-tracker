import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  /** Optional action rendered at the trailing edge (e.g. a Delete button). */
  trailing?: React.ReactNode;
  /** Defaults to navigate(-1). */
  onBack?: () => void;
}

/**
 * Top bar for standalone, pushed full-screen screens (Settings, edit pages):
 * a back chevron, a title, and an optional trailing action.
 */
export function ScreenHeader({ title, trailing, onBack }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex-shrink-0 sticky top-0 z-10 flex items-center gap-1 h-14 px-3 bg-background/90 backdrop-blur border-b border-border">
      <button
        onClick={() => (onBack ? onBack() : navigate(-1))}
        aria-label="Back"
        className="-ml-1 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-foreground"
      >
        <ChevronLeft size={22} />
      </button>
      <h1 className="flex-1 min-w-0 truncate text-[17px] font-bold tracking-tight">{title}</h1>
      {trailing && <div className="flex-shrink-0">{trailing}</div>}
    </div>
  );
}
