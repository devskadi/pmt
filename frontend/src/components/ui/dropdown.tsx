"use client";

import {
  createContext,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   DROPDOWN — Popover menu primitive
   Usage: <Dropdown> → <DropdownTrigger> + <DropdownMenu> → <DropdownItem>
   ----------------------------------------------------------------------- */

interface DropdownContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown compounds must be within <Dropdown>");
  return ctx;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ children, className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const toggle = useCallback(() => setOpen((prev) => !prev), []);
    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          close();
        }
      };
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      };
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, close]);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    return (
      <DropdownContext.Provider value={{ open, toggle, close }}>
        <div ref={setRefs} className={cn("relative inline-block", className)} {...props}>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }
);
Dropdown.displayName = "Dropdown";

export interface DropdownTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { toggle, open } = useDropdownContext();
    return (
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn("inline-flex items-center", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownTrigger.displayName = "DropdownTrigger";

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Alignment relative to trigger */
  align?: "start" | "end";
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, align = "start", className, ...props }, ref) => {
    const { open } = useDropdownContext();

    if (!open) return null;

    return (
      <div
        ref={ref}
        role="menu"
        className={cn(
          "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface p-1 shadow-md",
          "animate-scale-in",
          align === "end" ? "right-0" : "left-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenu.displayName = "DropdownMenu";

export interface DropdownItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  disabled?: boolean;
  /** Destructive styling */
  critical?: boolean;
}

const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ children, disabled, critical, className, onClick, ...props }, ref) => {
    const { close } = useDropdownContext();

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          close();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) {
              onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
              close();
            }
          }
        }}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none",
          "transition-colors duration-fast",
          "focus-visible:bg-surface-sunken",
          disabled && "pointer-events-none opacity-50",
          critical
            ? "text-critical hover:bg-critical-muted"
            : "text-foreground hover:bg-surface-sunken",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownItem.displayName = "DropdownItem";

export interface DropdownSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

const DropdownSeparator = forwardRef<HTMLDivElement, DropdownSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  )
);
DropdownSeparator.displayName = "DropdownSeparator";

export default Dropdown;
export { DropdownTrigger, DropdownMenu, DropdownItem, DropdownSeparator };
