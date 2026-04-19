"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "relative h-11 w-9 rounded-lg flex items-center justify-center transition-colors duration-150",
        "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
        "dark:text-gray-600 dark:hover:text-slate-200 dark:hover:bg-[#1e2540]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-transform duration-200 rotate-0" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-200 rotate-0" />
      )}
    </button>
  );
}
