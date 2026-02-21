"use client";

import { forwardRef, HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   TOAST — Notification primitive
   Variants: default | success | warning | critical
   ----------------------------------------------------------------------- */

type ToastVariant = "default" | "success" | "warning" | "critical";

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms (0 = persist) */
  duration?: number;
  /** Whether the toast is visible */
  open?: boolean;
  /** Called when the toast should dismiss */
  onDismiss?: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
  default: "bg-surface border-border text-foreground",
  success: "bg-success-muted border-success/20 text-success",
  warning: "bg-warning-muted border-warning/20 text-warning",
  critical: "bg-critical-muted border-critical/20 text-critical",
};

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      children,
      variant = "default",
      duration = 5000,
      open = true,
      onDismiss,
      className,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(open);

    useEffect(() => {
      setVisible(open);
    }, [open]);

    useEffect(() => {
      if (!visible || duration === 0) return;
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }, [visible, duration, onDismiss]);

    if (!visible) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border p-4 shadow-md",
          "animate-slide-in-right",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex-1 text-sm">{children}</div>
        {onDismiss && (
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              onDismiss();
            }}
            className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity duration-fast"
            aria-label="Dismiss notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";

export default Toast;
