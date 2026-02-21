"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/* -----------------------------------------------------------------------
   THEME PROVIDER — Wraps next-themes for class-based dark mode
   
   Strategy: class-based (`darkMode: "class"` in Tailwind config).
   The provider adds/removes `.dark` on <html> and persists preference
   to localStorage. System preference is respected as default.
   ----------------------------------------------------------------------- */

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
