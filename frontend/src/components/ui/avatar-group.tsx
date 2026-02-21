import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Avatar, { type AvatarProps } from "./avatar";

/* -----------------------------------------------------------------------
   AVATAR GROUP — Stacked avatar display with overflow count
   ----------------------------------------------------------------------- */

export interface AvatarGroupItem {
  src?: string;
  alt?: string;
  fallback?: string;
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of avatar data */
  avatars: AvatarGroupItem[];
  /** Maximum visible avatars before "+N" overflow */
  max?: number;
  /** Avatar size */
  size?: AvatarProps["size"];
}

const sizeOverlap: Record<string, string> = {
  xs: "-ml-1.5",
  sm: "-ml-2",
  md: "-ml-2.5",
  lg: "-ml-3",
};

const sizePx: Record<string, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max = 4, size = "sm", className, ...props }, ref) => {
    const visible = avatars.slice(0, max);
    const overflowCount = Math.max(0, avatars.length - max);

    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        role="group"
        aria-label={`${avatars.length} members`}
        {...props}
      >
        {visible.map((avatar, i) => (
          <Avatar
            key={i}
            src={avatar.src}
            alt={avatar.alt || ""}
            fallback={avatar.fallback}
            size={size}
            className={cn(
              "ring-2 ring-surface",
              i > 0 && sizeOverlap[size]
            )}
          />
        ))}
        {overflowCount > 0 && (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-muted ring-2 ring-surface",
              "font-medium text-muted-foreground",
              sizePx[size],
              sizeOverlap[size]
            )}
            aria-label={`${overflowCount} more members`}
          >
            +{overflowCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export default AvatarGroup;
