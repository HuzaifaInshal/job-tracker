import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border px-3 text-base transition-colors duration-150",
        "border-slate-200 bg-white text-slate-900 placeholder:text-gray-400",
        "focus:border-blue-500/60 focus:outline-none focus:ring-1 focus:ring-blue-500/30",
        "dark:border-[#2a3357] dark:bg-[#0d1120] dark:text-slate-200 dark:placeholder:text-slate-500",
        "dark:focus:border-blue-500/60 dark:focus:bg-[#0f1428]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
