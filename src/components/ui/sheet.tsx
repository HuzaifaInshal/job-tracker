"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] dark:bg-black/40",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  title,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { title?: string }) {
  return (
    <DialogPrimitive.Portal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[480px] max-w-[95vw] shadow-2xl",
          "border-l flex flex-col overflow-hidden",
          "border-slate-200 bg-white shadow-slate-200/30",
          "dark:border-[#1e2d45] dark:bg-[#0b0e1a] dark:shadow-black/60",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300 ease-out",
          className
        )}
        aria-describedby={undefined}
        {...props}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0 border-slate-100 dark:border-[#1e2d45]">
          {title ? (
            <DialogPrimitive.Title className="text-base font-semibold text-slate-800 dark:text-slate-200">
              {title}
            </DialogPrimitive.Title>
          ) : (
            <DialogPrimitive.Title className="sr-only">
              Panel
            </DialogPrimitive.Title>
          )}
          <SheetClose className="rounded-lg p-1.5 transition-colors text-gray-600 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-[#1e2540]">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent };
