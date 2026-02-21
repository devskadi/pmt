# PMT Design System

**Version:** 1.0.0  
**Last updated:** 2026-02-21

---

## 1. Design Principles

### Visual Philosophy

PMT follows a **minimal-elevation, token-driven** design language optimized for dense information display in project management contexts.

| Principle | Implementation |
|-----------|---------------|
| **Muted neutral base** | Surfaces use desaturated grays (`--surface`, `--surface-sunken`). Content, not chrome, takes visual priority. |
| **Accent-driven feedback** | Color is reserved for semantic meaning: status, actions, alerts. No decorative color. |
| **Soft borders, minimal shadow** | Cards use 1px borders + `shadow-xs`. Elevation is communicated through subtle layering, not heavy shadows. |
| **Whitespace as hierarchy** | Spacing tokens (`--space-section`, `--space-card`, `--space-element`) create visual rhythm without separators. |
| **Typography-first hierarchy** | Size + weight + color (foreground/muted/subtle) convey importance. No underlines, no all-caps (except sidebar labels). |

### Anti-Patterns (Prohibited)

- ❌ Hardcoded hex/rgb values — use tokens only
- ❌ Inline `style` attributes — Tailwind utilities only
- ❌ CDN imports for fonts/icons
- ❌ More than 2 levels of visual elevation on any screen
- ❌ Color as the sole accessibility indicator (always pair with text/icon)

---

## 2. Token Architecture

All visual values flow through a **three-layer token system**:

```
CSS Custom Properties (globals.css)
        ↓
Tailwind Config (tailwind.config.ts)
        ↓
Component Classes (via cn() utility)
```

### Color Token Families

| Family | Tokens | Purpose |
|--------|--------|---------|
| **Surface** | `background`, `surface`, `surface-raised`, `surface-overlay`, `surface-sunken` | Background layering |
| **Foreground** | `foreground`, `foreground-muted`, `foreground-subtle`, `foreground-inverse` | Text hierarchy |
| **Primary** | `primary`, `primary-hover`, `primary-active`, `primary-foreground`, `primary-muted` | Brand actions |
| **Accent** | `accent`, `accent-hover`, `accent-foreground`, `accent-muted` | Secondary emphasis |
| **Success** | `success`, `success-hover`, `success-foreground`, `success-muted` | Positive states |
| **Warning** | `warning`, `warning-hover`, `warning-foreground`, `warning-muted` | Caution states |
| **Critical** | `critical`, `critical-hover`, `critical-foreground`, `critical-muted` | Error/destructive |
| **Border** | `border`, `border-hover`, `border-focus` | Container edges |
| **Sidebar** | `sidebar`, `sidebar-foreground`, `sidebar-border`, `sidebar-hover`, `sidebar-active` | Navigation chrome |

### How Opacity Works

Colors are stored as raw HSL channels: `217 91% 60%` (not `hsl(217, 91%, 60%)`).

This enables Tailwind's opacity modifier:
```html
<div class="bg-primary/50">  →  background: hsl(217 91% 60% / 0.5)
```

---

## 3. Dark Mode Strategy

### Implementation

- **Method**: Class-based (`darkMode: "class"` in Tailwind)
- **Provider**: `next-themes` via `ThemeProvider` in `providers.tsx`
- **Persistence**: localStorage (key: `theme`)
- **Default**: System preference (`prefers-color-scheme`)
- **Transition**: `disableTransitionOnChange` to prevent flash

### Token Inversion Rules

| Light | Dark | Strategy |
|-------|------|----------|
| Near-white surfaces | Deep blue-gray surfaces | HSL lightness inversion |
| Dark text on light | Light text on dark | Automatic via `foreground` token |
| Light shadows | Deeper shadows | Increased opacity |
| Muted backgrounds (light tint) | Muted backgrounds (dark tint) | Color temperature shift |
| Bright hover states | Lighter hover states | Direction reversal (darker→lighter in dark mode) |

### WCAG AA Compliance

All foreground/background combinations meet minimum **4.5:1** contrast ratio for normal text and **3:1** for large text (18px+ bold or 24px+).

---

## 4. Component Inventory

### Core Primitives (`components/ui/`)

| Component | Variants | Props | File |
|-----------|----------|-------|------|
| **Button** | primary, secondary, ghost, critical, link | size, fullWidth, loading, disabled | `button.tsx` |
| **Card** | default, critical, accent, ghost | interactive, noPadding + CardHeader/Title/Content/Footer | `card.tsx` |
| **Badge** | default, success, warning, critical, accent, outline | dot | `badge.tsx` |
| **Input** | — | error | `input.tsx` |
| **Avatar** | — | size (xs/sm/md/lg), src, fallback | `avatar.tsx` |
| **Skeleton** | — | circle | `skeleton.tsx` |
| **Modal** | — | open, onClose, title, maxWidth | `modal.tsx` |
| **Table** | — | Compound: TableHeader/Body/Row/Head/Cell | `table.tsx` |
| **Tabs** | — | Compound: TabsList/Trigger/Content | `tabs.tsx` |
| **Dropdown** | — | Compound: Trigger/Menu/Item/Separator | `dropdown.tsx` |
| **Toast** | default, success, warning, critical | duration, open, onDismiss | `toast.tsx` |

### Dashboard Primitives (`components/ui/`)

| Component | Purpose | File |
|-----------|---------|------|
| **ProgressRing** | Circular SVG progress indicator | `progress-ring.tsx` |
| **SelectionTile** | Radio/checkbox option card | `selection-tile.tsx` |
| **IconTile** | Icon + label metric display | `icon-tile.tsx` |
| **SectionHeader** | Section heading with action slot | `section-header.tsx` |
| **ToggleGroup** | Exclusive radio button group | `toggle-group.tsx` |
| **AvatarGroup** | Stacked avatar display with overflow | `avatar-group.tsx` |

### Layout Components (`components/layout/`)

| Component | Purpose | File |
|-----------|---------|------|
| **BentoGrid** | Responsive CSS Grid dashboard layout | `bento-grid.tsx` |
| **BentoCell** | Individual grid cell with configurable span | `bento-grid.tsx` |
| **PageContainer** | Max-width + responsive padding wrapper | `page-container.tsx` |
| **PageHeader** | Page title + description + actions | `page-header.tsx` |
| **Breadcrumbs** | Navigation path indicator | `breadcrumbs.tsx` |
| **Sidebar** | Collapsible navigation sidebar | `sidebar.tsx` |
| **Topbar** | Horizontal navigation bar | `topbar.tsx` |
| **Footer** | Page footer | `footer.tsx` |

### Shared Components (`components/shared/`)

| Component | Purpose | File |
|-----------|---------|------|
| **ThemeProvider** | next-themes wrapper | `theme-provider.tsx` |
| **ThemeToggle** | Light/dark/system cycle button | `theme-toggle.tsx` |

---

## 5. Layout System

### BentoGrid

The primary dashboard layout uses a CSS Grid-based "bento" system:

```
┌──────────┬──────────┬──────────┬──────────┐
│ Cell 1   │ Cell 2   │       Cell 3         │
│ (1 col)  │ (1 col)  │      (2 cols)        │
├──────────┴──────────┼──────────┬──────────┤
│    Cell 4           │ Cell 5   │ Cell 6   │
│   (2 cols)          │ (1 col)  │ (1 col)  │
└─────────────────────┴──────────┴──────────┘
```

### Responsive Breakpoints

| Breakpoint | Width | Columns | Behavior |
|------------|-------|---------|----------|
| Mobile | < 640px | 1 | Single column stack |
| Tablet | 640–1023px | 2 | 2-column grid |
| Desktop | 1024px+ | Configurable (2/3/4/6) | Full bento layout |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-element` | 0.75rem (12px) | Between sibling elements |
| `--space-card` | 1.25rem (20px) | Card internal padding |
| `--space-section` | 1.5rem (24px) | Between page sections |

---

## 6. State & Interaction Model

### Hover Philosophy

- Surfaces: subtle background shift (`hover:bg-surface-sunken`)
- Borders: darken on hover (`hover:border-border-hover`)
- Interactive cards: add shadow (`hover:shadow-md`)
- Never change text color on hover alone — pair with background

### Focus

- Visible focus ring: `ring-2 ring-ring ring-offset-2 ring-offset-background`
- Applied via `focus-visible` (not `focus`) to avoid mouse-click rings
- All interactive elements must have focus styling

### Disabled

- `opacity-50` + `pointer-events-none`
- Consistent across all interactive components

### Motion

| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-fast` | 100ms | Hover states, color transitions |
| `--duration-normal` | 200ms | Reveals, tab switches, modals |
| `--duration-slow` | 350ms | Page transitions, complex animations |

| Easing | Curve | Usage |
|--------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful scale-in |

---

## 7. Folder Structure

```
frontend/src/
├── app/
│   ├── globals.css          ← Design tokens (CSS custom properties)
│   ├── layout.tsx           ← Root layout (font, providers)
│   └── providers.tsx        ← Client provider composition
├── components/
│   ├── ui/                  ← Atomic UI primitives (domain-agnostic)
│   │   ├── index.ts         ← Barrel export
│   │   ├── avatar.tsx
│   │   ├── avatar-group.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown.tsx
│   │   ├── icon-tile.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── progress-ring.tsx
│   │   ├── section-header.tsx
│   │   ├── selection-tile.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── toggle-group.tsx
│   ├── layout/              ← Layout primitives
│   │   ├── bento-grid.tsx
│   │   ├── breadcrumbs.tsx
│   │   ├── footer.tsx
│   │   ├── page-container.tsx
│   │   ├── page-header.tsx
│   │   ├── sidebar.tsx
│   │   └── topbar.tsx
│   └── shared/              ← Cross-cutting shared components
│       ├── theme-provider.tsx
│       └── theme-toggle.tsx
├── lib/
│   └── utils.ts             ← cn() utility (clsx + tailwind-merge)
└── tailwind.config.ts       ← Token-mapped Tailwind configuration
```

---

## 8. Usage Examples

### Button variants
```tsx
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="sm">Edit</Button>
<Button variant="critical" loading>Delete</Button>
```

### Card with subcomponents
```tsx
<Card>
  <CardHeader>
    <CardTitle>Sprint 12</CardTitle>
    <Badge variant="success" dot>Active</Badge>
  </CardHeader>
  <CardContent>
    <ProgressRing value={68} variant="primary" />
  </CardContent>
</Card>
```

### BentoGrid dashboard
```tsx
<BentoGrid columns={4} gap="md">
  <BentoCell colSpan={2}>
    <Card>Wide card</Card>
  </BentoCell>
  <BentoCell>
    <Card>Normal card</Card>
  </BentoCell>
  <BentoCell>
    <Card>Normal card</Card>
  </BentoCell>
</BentoGrid>
```

---

## 9. Rules for Contributors

1. **No hardcoded colors** — Every color must reference a CSS custom property via the Tailwind config.
2. **No inline styles** — All styling through Tailwind utility classes.
3. **No CDN imports** — Fonts via `next/font`, icons via `lucide-react`.
4. **Variant props, not className overrides** — Add variants to components, don't bypass with raw classes.
5. **Always use `cn()`** — For all className composition. Never concatenate strings.
6. **forwardRef on all primitives** — Enable ref forwarding for composition.
7. **ARIA attributes on all interactive elements** — Labels, roles, states.
8. **Test dark mode** — Every component must look correct in both themes.
