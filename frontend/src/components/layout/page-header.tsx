import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   PAGE HEADER — Top-of-page heading with optional actions and breadcrumbs
   ----------------------------------------------------------------------- */

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title: string;
  /** Optional description */
  description?: string;
  /** Breadcrumb slot (rendered above title) */
  breadcrumbs?: ReactNode;
  /** Action slot (right-aligned) */
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 pb-section", className)} {...props}>
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
