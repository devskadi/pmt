"use client";

import {
  createContext,
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useContext,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   TOGGLE GROUP — Exclusive selection group (radio-like button group)
   Usage: <ToggleGroup> → <ToggleGroupItem value="a">A</ToggleGroupItem>
   ----------------------------------------------------------------------- */

interface ToggleGroupContextValue {
  value: string;
  onChange: (value: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext(): ToggleGroupContextValue {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error("ToggleGroupItem must be within <ToggleGroup>");
  return ctx;
}

export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Default selected value */
  defaultValue: string;
  /** Controlled value */
  value?: string;
  /** Change handler */
  onValueChange?: (value: string) => void;
  /** Size variant */
  size?: "sm" | "md";
}

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      children,
      defaultValue,
      value: controlledValue,
      onValueChange,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const onChange = (v: string) => {
      setInternalValue(v);
      onValueChange?.(v);
    };

    return (
      <ToggleGroupContext.Provider value={{ value, onChange }}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn(
            "inline-flex items-center gap-0.5 rounded-lg bg-surface-sunken p-0.5",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  value: string;
  disabled?: boolean;
}

const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ children, value, disabled, className, ...props }, ref) => {
    const { value: selectedValue, onChange } = useToggleGroupContext();
    const isActive = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isActive}
        disabled={disabled}
        onClick={() => onChange(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium",
          "transition-all duration-fast",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          isActive
            ? "bg-surface text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export default ToggleGroup;
export { ToggleGroupItem };
