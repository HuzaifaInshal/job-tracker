import { cn } from "@/lib/utils";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type ApplicationStatus
} from "@/lib/types";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  className,
  size = "md"
}: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium",
        colors.bg,
        colors.text,
        colors.border,
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-sm",
        className
      )}
    >
      <span
        className={cn(
          "rounded-full shrink-0",
          colors.dot,
          size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5"
        )}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
