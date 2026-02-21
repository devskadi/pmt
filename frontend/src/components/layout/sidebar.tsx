"use client";

import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   SIDEBAR — Navigation sidebar with collapsible support
   ----------------------------------------------------------------------- */

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Whether the sidebar is collapsed (icon-only mode) */
  collapsed?: boolean;
}

export default function Sidebar({
  children,
  collapsed = false,
  className,
  ...props
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar",
        "transition-all duration-slow",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

/* -----------------------------------------------------------------------
   SIDEBAR SECTION — Groups nav items with an optional label
   ----------------------------------------------------------------------- */

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  label?: string;
}

export function SidebarSection({ children, label, className, ...props }: SidebarSectionProps) {
  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {label && (
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

/* -----------------------------------------------------------------------
   SIDEBAR ITEM — Individual navigation link
   ----------------------------------------------------------------------- */

export interface SidebarItemProps extends HTMLAttributes<HTMLAnchorElement> {
  /** Icon element */
  icon?: ReactNode;
  /** Label text */
  label: string;
  /** Navigation href */
  href?: string;
  /** Active state */
  active?: boolean;
  /** Collapsed mode (from parent) */
  collapsed?: boolean;
}

export function SidebarItem({
  icon,
  label,
  href = "#",
  active = false,
  collapsed = false,
  className,
  ...props
}: SidebarItemProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium",
        "transition-colors duration-fast",
        active
          ? "bg-sidebar-active text-sidebar-active-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-hover",
        collapsed && "justify-center px-0",
        className
      )}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      {...props}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {!collapsed && <span className="truncate">{label}</span>}
    </a>
  );
}
