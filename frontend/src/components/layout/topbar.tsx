import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   TOPBAR — Horizontal navigation bar
   ----------------------------------------------------------------------- */

export interface TopbarProps extends HTMLAttributes<HTMLElement> {
  /** Left slot (logo, hamburger, breadcrumbs) */
  leading?: ReactNode;
  /** Center slot (search, title) */
  center?: ReactNode;
  /** Right slot (user menu, notifications, theme toggle) */
  trailing?: ReactNode;
}

export default function Topbar({
  leading,
  center,
  trailing,
  className,
  ...props
}: TopbarProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-4 border-b border-border bg-surface px-4",
        className
      )}
      {...props}
    >
      {leading && <div className="flex items-center gap-2">{leading}</div>}
      {center && <div className="flex flex-1 items-center justify-center">{center}</div>}
      {trailing && <div className="ml-auto flex items-center gap-2">{trailing}</div>}
    </header>
  );
}
