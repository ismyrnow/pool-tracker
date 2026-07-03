import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ConfirmSheet } from "@/components/ui/ConfirmSheet";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  /** Noun used in the delete confirmation, e.g. "test log". */
  logLabel: string;
  saving: boolean;
  canSave: boolean;
  onSave: () => void;
  /** Perform the delete; the screen owns the confirm sheet + busy state. */
  onDelete: () => Promise<void>;
  children: React.ReactNode;
}

/** Shared chrome for the standalone edit pages: back/title/Delete header, fields, Save. */
export function EditLogScreen({
  title,
  logLabel,
  saving,
  canSave,
  onSave,
  onDelete,
  children,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ScreenHeader
        title={title}
        trailing={
          <button
            onClick={() => setConfirmOpen(true)}
            aria-label="Delete"
            className="w-9 h-9 rounded-full flex items-center justify-center text-destructive"
          >
            <Trash2 size={18} />
          </button>
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-8 flex flex-col gap-4">
        {children}

        <Button
          className="w-full h-[52px] text-[16px]"
          onClick={onSave}
          disabled={saving || !canSave}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <ConfirmSheet
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete this ${logLabel}?`}
        description="This can't be undone."
        busy={deleting}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
