import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

/* -----------------------------------------------------------------------
   ROOT LAYOUT
   
   - Loads Inter font via next/font (automatic subsetting + preload)
   - Wraps app in Providers (ThemeProvider, QueryClient, etc.)
   - suppressHydrationWarning on <html> is required by next-themes
     to prevent mismatch between server (no class) and client (.dark)
   ----------------------------------------------------------------------- */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "PMT",
  description: "Project Management Tool",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
