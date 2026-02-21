import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   BENTO GRID — Responsive dashboard grid layout
   
   Implements a CSS Grid-based bento layout system with configurable
   column spans. Responsive breakpoints:
   - mobile  (< 640px):  1 column
   - tablet  (640–1023px): 2 columns
   - desktop (1024px+):    configurable (default 4)
   ----------------------------------------------------------------------- */

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Number of columns at desktop breakpoint (default: 4) */
  columns?: 2 | 3 | 4 | 6;
  /** Gap between grid cells */
  gap?: "sm" | "md" | "lg";
}

const columnStyles: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
};

const gapStyles: Record<string, string> = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ children, columns = 4, gap = "md", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2",
        columnStyles[columns],
        gapStyles[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

BentoGrid.displayName = "BentoGrid";

/* -----------------------------------------------------------------------
   BENTO CELL — Individual grid cell with configurable span
   ----------------------------------------------------------------------- */

export interface BentoCellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Column span at desktop (default: 1) */
  colSpan?: 1 | 2 | 3 | 4;
  /** Row span (default: 1) */
  rowSpan?: 1 | 2 | 3;
}

const colSpanStyles: Record<number, string> = {
  1: "lg:col-span-1",
  2: "sm:col-span-2 lg:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
};

const rowSpanStyles: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

const BentoCell = forwardRef<HTMLDivElement, BentoCellProps>(
  ({ children, colSpan = 1, rowSpan = 1, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        colSpanStyles[colSpan],
        rowSpanStyles[rowSpan],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

BentoCell.displayName = "BentoCell";

export default BentoGrid;
export { BentoCell };
