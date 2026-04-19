"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useState, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  copyText?: string;
}

export function Tooltip({ content, children, copyText }: TooltipProps) {
  const [copied, setCopied] = useState(false);

  if (!content) return <>{children}</>;

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    const text = copyText ?? (typeof content === "string" ? content : "");
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const copyable = copyText ?? (typeof content === "string" ? content : null);

  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={6}
            className="z-50 flex items-center gap-2 max-w-xs break-words rounded-md bg-slate-900 px-3 py-1.5 text-sm text-slate-100 shadow-lg
              data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
              transition-all duration-150 ease-out"
          >
            <span className="flex-1">{content}</span>
            {copyable && (
              <button
                onClick={handleCopy}
                className="shrink-0 ml-1 p-0.5 rounded hover:bg-slate-700 transition-colors"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            )}
            <TooltipPrimitive.Arrow className="fill-slate-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
