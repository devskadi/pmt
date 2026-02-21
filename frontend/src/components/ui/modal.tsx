"use client";

import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   MODAL — Dialog overlay primitive
   Uses native <dialog> for accessibility (Escape, focus trap, inert).
   ----------------------------------------------------------------------- */

export interface ModalProps extends HTMLAttributes<HTMLDialogElement> {
  children: ReactNode;
  /** Controls visibility */
  open: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Title for the modal header (also sets aria-label) */
  title?: string;
  /** Max width class override */
  maxWidth?: string;
}

const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      children,
      open,
      onClose,
      title,
      maxWidth = "max-w-lg",
      className,
      ...props
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const setRef = useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    }, [open]);

    return (
      <dialog
        ref={setRef}
        className={cn(
          "fixed inset-0 z-50 m-auto w-full rounded-lg border border-border bg-surface p-0 shadow-lg",
          "backdrop:bg-foreground/40 backdrop:backdrop-blur-sm",
          "animate-scale-in",
          maxWidth,
          className
        )}
        aria-label={title}
        onClose={onClose}
        {...props}
      >
        <div className="flex flex-col gap-element p-card">
          {title && (
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-fast"
                aria-label="Close dialog"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
            </div>
          )}
          {children}
        </div>
      </dialog>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
