import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   SKELETON — Loading placeholder primitive
   ----------------------------------------------------------------------- */

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Renders a circular skeleton (for avatars) */
  circle?: boolean;
}

export default function Skeleton({ circle, className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse-gentle bg-muted",
        circle ? "rounded-full" : "rounded-md",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
