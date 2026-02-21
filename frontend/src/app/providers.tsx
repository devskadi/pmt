"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/shared/theme-provider";

/* -----------------------------------------------------------------------
   PROVIDERS — Client-side provider composition root
   
   All client-side context providers are composed here and wrapped
   around the app in layout.tsx. Order matters for nesting.
   ----------------------------------------------------------------------- */

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {/* TODO(PMT-100): Add QueryClientProvider when TanStack Query is wired — [severity: medium] */}
      {/* TODO(PMT-101): Add ToastProvider for global toast notifications — [severity: low] */}
      {children}
    </ThemeProvider>
  );
}
