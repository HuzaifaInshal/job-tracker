import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border px-3 py-2 text-base resize-none transition-colors duration-150",
      "border-slate-200 bg-white text-slate-900 placeholder:text-gray-600",
      "focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/30",
      "dark:border-[#2a3357] dark:bg-[#0d1120] dark:text-slate-200 dark:placeholder:text-slate-500",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
