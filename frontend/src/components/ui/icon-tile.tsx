import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   ICON TILE — Icon-centric display tile (for metric cards, feature grids)
   ----------------------------------------------------------------------- */

export interface IconTileProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon element (e.g. lucide-react icon component) */
  icon: ReactNode;
  /** Primary label */
  label: string;
  /** Optional sublabel or value */
  sublabel?: string;
  /** Background color variant for the icon container */
  color?: "primary" | "success" | "warning" | "critical" | "accent" | "muted";
}

const iconBgStyles: Record<string, string> = {
  primary: "bg-primary-muted text-primary",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  critical: "bg-critical-muted text-critical",
  accent: "bg-accent-muted text-accent",
  muted: "bg-muted text-muted-foreground",
};

const IconTile = forwardRef<HTMLDivElement, IconTileProps>(
  ({ icon, label, sublabel, color = "primary", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          iconBgStyles[color]
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground truncate">{sublabel}</p>
        )}
      </div>
    </div>
  )
);

IconTile.displayName = "IconTile";

export default IconTile;
