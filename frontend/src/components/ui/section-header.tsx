import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   SECTION HEADER — Page/card section heading with optional action slot
   ----------------------------------------------------------------------- */

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Heading level for accessibility */
  as?: "h1" | "h2" | "h3" | "h4";
  /** Optional action slot (right-aligned) */
  action?: ReactNode;
}

const headingStyles: Record<string, string> = {
  h1: "text-2xl font-bold tracking-tight",
  h2: "text-xl font-semibold tracking-tight",
  h3: "text-base font-semibold",
  h4: "text-sm font-semibold",
};

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, description, as: Tag = "h2", action, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-start justify-between gap-4", className)}
      {...props}
    >
      <div className="min-w-0">
        <Tag className={cn(headingStyles[Tag], "text-foreground")}>
          {title}
        </Tag>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
