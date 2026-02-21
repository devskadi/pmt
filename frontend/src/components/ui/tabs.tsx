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
   TABS — Compound tab primitive
   Usage: <Tabs defaultValue="tab1"> → <TabsList> → <TabsTrigger> + <TabsContent>
   ----------------------------------------------------------------------- */

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, defaultValue, value: controlledValue, onValueChange, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const onChange = (v: string) => {
      setInternalValue(v);
      onValueChange?.(v);
    };

    return (
      <TabsContext.Provider value={{ value, onChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-lg bg-surface-sunken p-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  value: string;
  disabled?: boolean;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, value, disabled, className, ...props }, ref) => {
    const { value: selectedValue, onChange } = useTabsContext();
    const isActive = selectedValue === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        disabled={disabled}
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => onChange(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium",
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
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, value, className, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();

    if (selectedValue !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn("mt-3 animate-fade-in", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export default Tabs;
export { TabsList, TabsTrigger, TabsContent };
