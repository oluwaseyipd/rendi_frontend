import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, error, ...props }, ref) => {
    if (prefix) {
      return (
        <div className={cn(
          "flex items-center rounded-xl border bg-white transition-colors",
          error ? "border-destructive focus-within:ring-destructive/30" : "border-input focus-within:border-rendi-400 focus-within:ring-2 focus-within:ring-rendi-500/20",
        )}>
          <span className="pl-4 pr-2 text-muted-foreground font-medium text-sm select-none">
            {prefix}
          </span>
          <input
            type={type}
            className={cn(
              "flex-1 py-3 pr-4 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm transition-colors",
          "placeholder:text-muted-foreground/60",
          "focus-visible:outline-none focus-visible:ring-2",
          error
            ? "border-destructive focus-visible:ring-destructive/30"
            : "border-input focus-visible:border-rendi-400 focus-visible:ring-rendi-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export { Input };
