import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   INPUT — Form input primitive
   ----------------------------------------------------------------------- */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Show error styling */
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border bg-surface px-3 py-1 text-sm shadow-xs",
        "transition-colors duration-fast",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-critical text-critical focus-visible:ring-critical"
          : "border-input hover:border-input-hover",
        className
      )}
      aria-invalid={error || undefined}
      {...props}
    />
  )
);

Input.displayName = "Input";

export default Input;
