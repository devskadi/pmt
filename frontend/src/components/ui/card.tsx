import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   CARD — Surface container primitive
   Variants: default | critical | accent | ghost
   ----------------------------------------------------------------------- */

type CardVariant = "default" | "critical" | "accent" | "ghost";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  /** Adds hover elevation effect */
  interactive?: boolean;
  /** Removes padding (for custom card bodies) */
  noPadding?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-surface border border-border shadow-xs",
  critical: "bg-critical-muted border border-critical/20",
  accent: "bg-accent-muted border border-accent/20",
  ghost: "bg-transparent border border-transparent",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      interactive = false,
      noPadding = false,
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg transition-shadow duration-fast",
        variantStyles[variant],
        interactive && "cursor-pointer hover:shadow-md hover:border-border-hover",
        !noPadding && "p-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";

/* -----------------------------------------------------------------------
   CARD SUB-COMPONENTS
   ----------------------------------------------------------------------- */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between pb-element", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h2" | "h3" | "h4";
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, as: Tag = "h3", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </Tag>
  )
);
CardTitle.displayName = "CardTitle";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm", className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-element border-t border-border", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

export default Card;
export { CardHeader, CardTitle, CardContent, CardFooter };
