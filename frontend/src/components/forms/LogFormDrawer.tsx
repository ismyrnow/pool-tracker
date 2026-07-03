import { X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  submitLabel: string;
  saving: boolean;
  canSave: boolean;
  onSubmit: () => void;
  children: React.ReactNode;
}

/** Shared drawer chrome for the create ("Log …") forms: header, scroll body, Save. */
export function LogFormDrawer({
  open,
  onClose,
  title,
  description,
  submitLabel,
  saving,
  canSave,
  onSubmit,
  children,
}: Props) {
  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent>
        {/* Header */}
        <div className="px-4 pt-4 pb-0 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <DrawerTitle className="text-[20px] font-bold leading-tight text-left">
              {title}
            </DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button className="mt-0.5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
              <X size={15} />
            </button>
          </DrawerClose>
        </div>

        {/* Body */}
        <div className="px-4 pt-4 pb-8 flex flex-col gap-4 overflow-y-auto">
          {children}

          <Button
            className="w-full h-[52px] text-[16px]"
            onClick={onSubmit}
            disabled={saving || !canSave}
          >
            {saving ? "Saving…" : submitLabel}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
