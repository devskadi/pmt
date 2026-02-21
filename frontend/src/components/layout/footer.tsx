import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------
   FOOTER — Page footer
   ----------------------------------------------------------------------- */

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Copyright or version text */
  text?: string;
}

export default function Footer({
  text = "© PMT — Project Management Tool",
  className,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(
        "flex h-12 items-center justify-center border-t border-border bg-surface px-4",
        "text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {text}
    </footer>
  );
}
