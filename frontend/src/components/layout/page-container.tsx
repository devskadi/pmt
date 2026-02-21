import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   PAGE CONTAINER — Constrains content width with responsive padding
   ----------------------------------------------------------------------- */

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Max width constraint */
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeStyles: Record<string, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[90rem]",
  full: "max-w-full",
};

const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, size = "xl", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

PageContainer.displayName = "PageContainer";

export default PageContainer;
