import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ClipboardEvent } from "react";

// Maps Unicode mathematical/styled variants back to plain ASCII
function normalizeUnicode(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u{1D400}-\u{1D7FF}]/gu, (ch) => {
      const cp = ch.codePointAt(0)!;
      // Mathematical Bold/Italic/Script/Fraktur capital A starts at 0x1D400
      // We map each block back to its base ASCII range
      const ranges: [number, number, number][] = [
        [0x1D400, 0x1D419, 65], // Bold capital A-Z
        [0x1D41A, 0x1D433, 97], // Bold small a-z
        [0x1D434, 0x1D44D, 65], // Italic capital A-Z
        [0x1D44E, 0x1D467, 97], // Italic small a-z
        [0x1D468, 0x1D481, 65], // Bold Italic capital A-Z
        [0x1D482, 0x1D49B, 97], // Bold Italic small a-z
        [0x1D49C, 0x1D4B5, 65], // Script capital A-Z
        [0x1D4B6, 0x1D4CF, 97], // Script small a-z
        [0x1D4D0, 0x1D4E9, 65], // Bold Script capital A-Z
        [0x1D4EA, 0x1D503, 97], // Bold Script small a-z
        [0x1D504, 0x1D51D, 65], // Fraktur capital A-Z
        [0x1D51E, 0x1D537, 97], // Fraktur small a-z
        [0x1D538, 0x1D551, 65], // Double-struck capital A-Z
        [0x1D552, 0x1D56B, 97], // Double-struck small a-z
        [0x1D56C, 0x1D585, 65], // Bold Fraktur capital A-Z
        [0x1D586, 0x1D59F, 97], // Bold Fraktur small a-z
        [0x1D5A0, 0x1D5B9, 65], // Sans-serif capital A-Z
        [0x1D5BA, 0x1D5D3, 97], // Sans-serif small a-z
        [0x1D5D4, 0x1D5ED, 65], // Sans-serif Bold capital A-Z
        [0x1D5EE, 0x1D607, 97], // Sans-serif Bold small a-z
        [0x1D608, 0x1D621, 65], // Sans-serif Italic capital A-Z
        [0x1D622, 0x1D63B, 97], // Sans-serif Italic small a-z
        [0x1D63C, 0x1D655, 65], // Sans-serif Bold Italic capital A-Z
        [0x1D656, 0x1D66F, 97], // Sans-serif Bold Italic small a-z
        [0x1D670, 0x1D689, 65], // Monospace capital A-Z
        [0x1D68A, 0x1D6A3, 97], // Monospace small a-z
        [0x1D7CE, 0x1D7D7, 48], // Bold digits 0-9
        [0x1D7D8, 0x1D7E1, 48], // Double-struck digits 0-9
        [0x1D7E2, 0x1D7EB, 48], // Sans-serif digits 0-9
        [0x1D7EC, 0x1D7F5, 48], // Sans-serif Bold digits 0-9
        [0x1D7F6, 0x1D7FF, 48], // Monospace digits 0-9
      ];
      for (const [start, end, base] of ranges) {
        if (cp >= start && cp <= end) return String.fromCharCode(base + (cp - start));
      }
      return ch;
    });
}

function handlePasteNormalize(e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
  const raw = e.clipboardData.getData("text/plain");
  const normalized = normalizeUnicode(raw);
  if (normalized !== raw) {
    e.preventDefault();
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { selectionStart, selectionEnd, value } = target;
    const next = value.slice(0, selectionStart ?? 0) + normalized + value.slice(selectionEnd ?? 0);
    // Use native input setter to trigger React's onChange
    const nativeInputSetter = Object.getOwnPropertyDescriptor(
      selectionStart !== null ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype,
      "value"
    )?.set;
    nativeInputSetter?.call(target, next);
    target.dispatchEvent(new Event("input", { bubbles: true }));
    // Restore cursor
    const pos = (selectionStart ?? 0) + normalized.length;
    requestAnimationFrame(() => target.setSelectionRange(pos, pos));
  }
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, onPaste, ...props }, ref) => (
    <input
      ref={ref}
      onPaste={(e) => {
        handlePasteNormalize(e as unknown as ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>);
        onPaste?.(e);
      }}
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

export { Input, handlePasteNormalize, normalizeUnicode };
