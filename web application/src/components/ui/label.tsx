import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "block text-sm font-medium mb-1.5",
        "text-slate-500 dark:text-gray-600",
        className
      )}
      {...props}
    />
  );
}

export { Label };
