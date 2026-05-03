import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "primary" && [
          "bg-amber-400 text-stone-950 rounded-lg",
          "hover:bg-amber-300 active:scale-95",
        ],
        variant === "ghost" && [
          "bg-transparent text-stone-400 border border-white/10 rounded-lg",
          "hover:border-white/25 hover:text-white active:scale-95",
        ],
        size === "md" && "px-6 py-3 text-sm tracking-wide",
        size === "sm" && "px-4 py-2 text-xs tracking-wide",
        className
      )}
      {...props}
    />
  );
}