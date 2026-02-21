import { forwardRef, SVGAttributes } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   PROGRESS RING — Circular SVG progress indicator
   ----------------------------------------------------------------------- */

export interface ProgressRingProps extends SVGAttributes<SVGSVGElement> {
  /** Current value (0–100) */
  value: number;
  /** Diameter in px */
  size?: number;
  /** Stroke thickness in px */
  strokeWidth?: number;
  /** Color variant */
  variant?: "primary" | "success" | "warning" | "critical" | "accent";
  /** Show percentage label inside */
  showLabel?: boolean;
}

const colorMap: Record<string, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  critical: "text-critical",
  accent: "text-accent",
};

const trackColor = "text-border";

const ProgressRing = forwardRef<SVGSVGElement, ProgressRingProps>(
  (
    {
      value,
      size = 48,
      strokeWidth = 4,
      variant = "primary",
      showLabel = true,
      className,
      ...props
    },
    ref
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          className={cn("transform -rotate-90", className)}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          {...props}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className={trackColor}
            fill="none"
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className={cn(colorMap[variant], "transition-all duration-slow")}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        {showLabel && (
          <span className="absolute text-xs font-semibold text-foreground">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    );
  }
);

ProgressRing.displayName = "ProgressRing";

export default ProgressRing;
