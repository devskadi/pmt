"use client";

import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   SELECTION TILE — Selectable card option (radio/checkbox pattern)
   Used for plan selection, preference pickers, option grids.
   ----------------------------------------------------------------------- */

export interface SelectionTileProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Whether this tile is currently selected */
  selected?: boolean;
  /** Whether interaction is disabled */
  disabled?: boolean;
  /** Visual variant when selected */
  variant?: "primary" | "accent";
}

const selectedStyles: Record<string, string> = {
  primary: "border-primary bg-primary-muted ring-2 ring-primary/20",
  accent: "border-accent bg-accent-muted ring-2 ring-accent/20",
};

const SelectionTile = forwardRef<HTMLDivElement, SelectionTileProps>(
  (
    {
      children,
      selected = false,
      disabled = false,
      variant = "primary",
      className,
      onClick,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      className={cn(
        "cursor-pointer rounded-lg border p-card",
        "transition-all duration-fast",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-50",
        selected
          ? selectedStyles[variant]
          : "border-border bg-surface hover:border-border-hover hover:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

SelectionTile.displayName = "SelectionTile";

export default SelectionTile;
