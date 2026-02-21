import type { Config } from "tailwindcss";

/**
 * PMT Design System — Tailwind Configuration
 *
 * All semantic colors reference CSS custom properties defined in globals.css.
 * HSL channels are stored as raw values (e.g. "217 91% 60%") so Tailwind's
 * opacity modifier works natively: `bg-primary/50` → `hsl(217 91% 60% / 0.5)`.
 *
 * Never use hardcoded hex values. All colors flow through the token layer.
 */

function hslVar(variable: string): string {
  return `hsl(var(--${variable}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    /* ----------------------------------------------------------------
       CONTAINER
       ---------------------------------------------------------------- */
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },

    extend: {
      /* --------------------------------------------------------------
         COLORS — Semantic tokens mapped to CSS custom properties
         -------------------------------------------------------------- */
      colors: {
        background: hslVar("background"),
        foreground: hslVar("foreground"),

        surface: {
          DEFAULT: hslVar("surface"),
          raised: hslVar("surface-raised"),
          overlay: hslVar("surface-overlay"),
          sunken: hslVar("surface-sunken"),
        },

        muted: {
          DEFAULT: hslVar("surface-sunken"),
          foreground: hslVar("foreground-muted"),
        },

        subtle: {
          foreground: hslVar("foreground-subtle"),
        },

        primary: {
          DEFAULT: hslVar("primary"),
          hover: hslVar("primary-hover"),
          active: hslVar("primary-active"),
          foreground: hslVar("primary-foreground"),
          muted: hslVar("primary-muted"),
        },

        accent: {
          DEFAULT: hslVar("accent"),
          hover: hslVar("accent-hover"),
          foreground: hslVar("accent-foreground"),
          muted: hslVar("accent-muted"),
        },

        success: {
          DEFAULT: hslVar("success"),
          hover: hslVar("success-hover"),
          foreground: hslVar("success-foreground"),
          muted: hslVar("success-muted"),
        },

        warning: {
          DEFAULT: hslVar("warning"),
          hover: hslVar("warning-hover"),
          foreground: hslVar("warning-foreground"),
          muted: hslVar("warning-muted"),
        },

        critical: {
          DEFAULT: hslVar("critical"),
          hover: hslVar("critical-hover"),
          foreground: hslVar("critical-foreground"),
          muted: hslVar("critical-muted"),
        },

        border: {
          DEFAULT: hslVar("border"),
          hover: hslVar("border-hover"),
          focus: hslVar("border-focus"),
        },

        ring: hslVar("ring"),

        input: {
          DEFAULT: hslVar("input"),
          hover: hslVar("input-hover"),
        },

        sidebar: {
          DEFAULT: hslVar("sidebar"),
          foreground: hslVar("sidebar-foreground"),
          border: hslVar("sidebar-border"),
          hover: hslVar("sidebar-hover"),
          active: hslVar("sidebar-active"),
          "active-foreground": hslVar("sidebar-active-foreground"),
        },
      },

      /* --------------------------------------------------------------
         FONTS
         -------------------------------------------------------------- */
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      /* --------------------------------------------------------------
         BORDER RADIUS — Token-mapped
         -------------------------------------------------------------- */
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },

      /* --------------------------------------------------------------
         BOX SHADOW — Token-mapped
         -------------------------------------------------------------- */
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },

      /* --------------------------------------------------------------
         SPACING — Extended scale
         -------------------------------------------------------------- */
      spacing: {
        section: "var(--space-section)",
        card: "var(--space-card)",
        element: "var(--space-element)",
      },

      /* --------------------------------------------------------------
         ANIMATION — Motion tokens
         -------------------------------------------------------------- */
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        default: "var(--ease-default)",
        in: "var(--ease-in)",
        out: "var(--ease-out)",
        bounce: "var(--ease-bounce)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "progress-indeterminate": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(400%)" },
        },
      },
      animation: {
        "fade-in": "fade-in var(--duration-normal) var(--ease-out)",
        "fade-out": "fade-out var(--duration-normal) var(--ease-in)",
        "slide-in-top": "slide-in-from-top var(--duration-normal) var(--ease-out)",
        "slide-in-bottom": "slide-in-from-bottom var(--duration-normal) var(--ease-out)",
        "slide-in-left": "slide-in-from-left var(--duration-normal) var(--ease-out)",
        "slide-in-right": "slide-in-from-right var(--duration-normal) var(--ease-out)",
        "scale-in": "scale-in var(--duration-normal) var(--ease-bounce)",
        "spin-slow": "spin-slow 3s linear infinite",
        "pulse-gentle": "pulse-gentle 2s var(--ease-default) infinite",
        "progress-indeterminate": "progress-indeterminate 1.5s var(--ease-default) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
