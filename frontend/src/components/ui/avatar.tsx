import { forwardRef, HTMLAttributes, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   AVATAR — User identity primitive
   Sizes: xs | sm | md | lg
   ----------------------------------------------------------------------- */

type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  /** Image source URL */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Fallback initials when no image */
  fallback?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ size = "md", src, alt = "", fallback, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        sizeStyles[size],
        className
      )}
      role="img"
      aria-label={alt}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="font-medium text-muted-foreground select-none">
          {fallback || alt.charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </div>
  )
);

Avatar.displayName = "Avatar";

export default Avatar;
