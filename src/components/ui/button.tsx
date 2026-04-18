"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-base font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-900/20",
        secondary:
          "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-slate-300 active:bg-slate-100 dark:bg-[#1e2540] dark:text-slate-200 dark:border-[#2a3357] dark:hover:bg-[#252d4a] dark:hover:border-[#3a4570]",
        ghost:
          "text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-gray-600 dark:hover:text-slate-200 dark:hover:bg-[#1a2035]",
        danger:
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 dark:bg-red-600/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-600/20",
        outline:
          "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-[#2a3357] dark:text-slate-300 dark:hover:bg-[#1e2540]",
        link: "text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-4 hover:underline p-0 h-auto"
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4",
        lg: "h-10 px-5 text-[15px]",
        icon: "h-11 w-9 p-0",
        "icon-sm": "h-9 w-9 p-0"
      }
    },
    defaultVariants: {
      variant: "secondary",
      size: "md"
    }
  }
);

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
