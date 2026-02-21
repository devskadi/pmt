import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   BADGE — Inline label / status indicator
   Variants: default | success | warning | critical | accent | outline
   ----------------------------------------------------------------------- */

type BadgeVariant = "default" | "success" | "warning" | "critical" | "accent" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  variant?: BadgeVariant;
  /** Renders a small dot indicator before the label */
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary-muted text-primary border-primary/20",
  success: "bg-success-muted text-success border-success/20",
  warning: "bg-warning-muted text-warning border-warning/20",
  critical: "bg-critical-muted text-critical border-critical/20",
  accent: "bg-accent-muted text-accent border-accent/20",
  outline: "bg-transparent text-foreground-muted border-border",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  critical: "bg-critical",
  accent: "bg-accent",
  outline: "bg-foreground-muted",
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "default", dot = false, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        "transition-colors duration-fast",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
);

Badge.displayName = "Badge";

export default Badge;
