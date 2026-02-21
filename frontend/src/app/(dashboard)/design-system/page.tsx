"use client";

import { useState } from "react";

// UI primitives
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Avatar,
  AvatarGroup,
  Skeleton,
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  Toast,
  ProgressRing,
  SelectionTile,
  IconTile,
  SectionHeader,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui";

// Layout primitives
import PageContainer from "@/components/layout/page-container";
import BentoGrid, { BentoCell } from "@/components/layout/bento-grid";

// Shared
import ThemeToggle from "@/components/shared/theme-toggle";

/* =======================================================================
   DESIGN SYSTEM — Living component showcase
   All UI primitives with every variant, size, and interactive state.
   ======================================================================= */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 space-y-4">
      <SectionHeader title={title} description={description} as="h2" />
      {children}
    </section>
  );
}

function Swatch({ label, token }: { label: string; token: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 shrink-0 rounded-lg border border-border shadow-xs"
        style={{ backgroundColor: `hsl(var(${token}))` }}
      />
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{label}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{token}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table of contents
// ---------------------------------------------------------------------------

const TOC = [
  { id: "colors", label: "Colors & Tokens" },
  { id: "buttons", label: "Button" },
  { id: "badges", label: "Badge" },
  { id: "inputs", label: "Input" },
  { id: "cards", label: "Card" },
  { id: "avatars", label: "Avatar & Group" },
  { id: "progress-ring", label: "Progress Ring" },
  { id: "icon-tile", label: "Icon Tile" },
  { id: "selection-tile", label: "Selection Tile" },
  { id: "section-header", label: "Section Header" },
  { id: "toggle-group", label: "Toggle Group" },
  { id: "tabs", label: "Tabs" },
  { id: "table", label: "Table" },
  { id: "dropdown", label: "Dropdown" },
  { id: "modal", label: "Modal" },
  { id: "toast", label: "Toast" },
  { id: "skeleton", label: "Skeleton" },
  { id: "bento-grid", label: "Bento Grid" },
  { id: "theme-toggle", label: "Theme Toggle" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<string | null>("option-a");
  const [toastVisible, setToastVisible] = useState(false);

  return (
    <PageContainer size="xl">
      <div className="py-8 space-y-12">
        {/* --- Page title --- */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Design System
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Living reference for every PMT UI primitive — variants, sizes, and
            interactive states. Use this page to verify visual consistency
            across themes.
          </p>
        </div>

        {/* --- TOC --- */}
        <nav className="flex flex-wrap gap-2">
          {TOC.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border-hover transition-colors duration-fast"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* =============================================================
            COLORS & TOKENS
            ============================================================= */}
        <Section
          id="colors"
          title="Colors & Tokens"
          description="Semantic color tokens — raw HSL channels for Tailwind opacity support."
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Surfaces */}
            <Swatch label="Background" token="--background" />
            <Swatch label="Surface" token="--surface" />
            <Swatch label="Surface Raised" token="--surface-raised" />
            <Swatch label="Surface Overlay" token="--surface-overlay" />
            <Swatch label="Surface Sunken" token="--surface-sunken" />
            {/* Brand */}
            <Swatch label="Primary" token="--primary" />
            <Swatch label="Primary Hover" token="--primary-hover" />
            <Swatch label="Primary Muted" token="--primary-muted" />
            <Swatch label="Accent" token="--accent" />
            <Swatch label="Accent Muted" token="--accent-muted" />
            {/* Semantic */}
            <Swatch label="Success" token="--success" />
            <Swatch label="Success Muted" token="--success-muted" />
            <Swatch label="Warning" token="--warning" />
            <Swatch label="Warning Muted" token="--warning-muted" />
            <Swatch label="Critical" token="--critical" />
            <Swatch label="Critical Muted" token="--critical-muted" />
            {/* Foreground */}
            <Swatch label="Foreground" token="--foreground" />
            <Swatch label="Foreground Muted" token="--foreground-muted" />
            <Swatch label="Foreground Subtle" token="--foreground-subtle" />
            {/* Borders */}
            <Swatch label="Border" token="--border" />
          </div>

          {/* Shadows */}
          <h3 className="text-sm font-semibold text-foreground mt-6">Shadows</h3>
          <div className="flex flex-wrap gap-6 mt-2">
            {(["xs", "sm", "md", "lg"] as const).map((s) => (
              <div
                key={s}
                className="flex h-20 w-20 items-center justify-center rounded-lg bg-surface border border-border"
                style={{ boxShadow: `var(--shadow-${s})` }}
              >
                <span className="text-xs font-mono text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>

          {/* Radius */}
          <h3 className="text-sm font-semibold text-foreground mt-6">Radius</h3>
          <div className="flex flex-wrap gap-6 mt-2">
            {(["sm", "md", "lg", "xl", "full"] as const).map((r) => (
              <div
                key={r}
                className="flex h-16 w-16 items-center justify-center bg-primary-muted border border-primary/30"
                style={{ borderRadius: `var(--radius-${r})` }}
              >
                <span className="text-[10px] font-mono text-primary">{r}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* =============================================================
            BUTTONS
            ============================================================= */}
        <Section
          id="buttons"
          title="Button"
          description="Variants: primary, secondary, ghost, critical, link · Sizes: sm, md, lg"
        >
          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="critical">Critical</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* States */}
          <Card>
            <CardHeader>
              <CardTitle>States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth variant="secondary">
                  Full Width
                </Button>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            BADGES
            ============================================================= */}
        <Section
          id="badges"
          title="Badge"
          description="Variants: default, success, warning, critical, accent, outline · Optional dot indicator"
        >
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="critical">Critical</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Badge variant="default" dot>Default</Badge>
                <Badge variant="success" dot>Success</Badge>
                <Badge variant="warning" dot>Warning</Badge>
                <Badge variant="critical" dot>Critical</Badge>
                <Badge variant="accent" dot>Accent</Badge>
                <Badge variant="outline" dot>Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            INPUTS
            ============================================================= */}
        <Section
          id="inputs"
          title="Input"
          description="Default, error, and disabled states"
        >
          <Card>
            <CardContent>
              <div className="grid gap-4 max-w-md">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">
                    Default
                  </label>
                  <Input placeholder="Enter text…" />
                </div>
                <div>
                  <label className="text-xs font-medium text-critical mb-1 block">
                    Error
                  </label>
                  <Input placeholder="Invalid input" error />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Disabled
                  </label>
                  <Input placeholder="Disabled" disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            CARDS
            ============================================================= */}
        <Section
          id="cards"
          title="Card"
          description="Variants: default, critical, accent, ghost · Interactive hover · Sub-components"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Standard surface card with border and shadow.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-muted-foreground">Footer slot</span>
              </CardFooter>
            </Card>

            <Card variant="critical">
              <CardHeader>
                <CardTitle>Critical</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Used for error or destructive contexts.
                </p>
              </CardContent>
            </Card>

            <Card variant="accent">
              <CardHeader>
                <CardTitle>Accent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Highlight or promotional context.
                </p>
              </CardContent>
            </Card>

            <Card variant="ghost">
              <CardHeader>
                <CardTitle>Ghost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No background, no border — grouping only.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card interactive>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <strong>Interactive</strong> — hover to see elevation change.
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            AVATARS
            ============================================================= */}
        <Section
          id="avatars"
          title="Avatar & Avatar Group"
          description="Sizes: xs, sm, md, lg · Image / fallback initials · Stacked group with overflow"
        >
          <Card>
            <CardHeader>
              <CardTitle>Individual Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <Avatar size="xs" fallback="XS" alt="Extra small" />
                <Avatar size="sm" fallback="SM" alt="Small" />
                <Avatar size="md" fallback="MD" alt="Medium" />
                <Avatar size="lg" fallback="LG" alt="Large" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar Group (max 3)</CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarGroup
                max={3}
                size="sm"
                avatars={[
                  { fallback: "JD", alt: "Jane Doe" },
                  { fallback: "AB", alt: "Alice Brown" },
                  { fallback: "CK", alt: "Chris Kim" },
                  { fallback: "MR", alt: "Maya Rios" },
                  { fallback: "TN", alt: "Tomas Ng" },
                ]}
              />
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            PROGRESS RING
            ============================================================= */}
        <Section
          id="progress-ring"
          title="Progress Ring"
          description="Variants: primary, success, warning, critical, accent · Configurable size and stroke"
        >
          <Card>
            <CardContent>
              <div className="flex flex-wrap items-center gap-8">
                <ProgressRing value={25} variant="primary" />
                <ProgressRing value={50} variant="success" />
                <ProgressRing value={65} variant="warning" />
                <ProgressRing value={80} variant="critical" />
                <ProgressRing value={100} variant="accent" />
                <ProgressRing value={42} size={72} strokeWidth={6} variant="primary" />
                <ProgressRing value={88} showLabel={false} variant="success" size={32} strokeWidth={3} />
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            ICON TILE
            ============================================================= */}
        <Section
          id="icon-tile"
          title="Icon Tile"
          description="Color variants: primary, success, warning, critical, accent, muted"
        >
          <Card>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <IconTile
                  icon={<PlaceholderIcon />}
                  label="Total Projects"
                  sublabel="24 active"
                  color="primary"
                />
                <IconTile
                  icon={<PlaceholderIcon />}
                  label="Completed"
                  sublabel="148 tasks"
                  color="success"
                />
                <IconTile
                  icon={<PlaceholderIcon />}
                  label="In Review"
                  sublabel="12 pending"
                  color="warning"
                />
                <IconTile
                  icon={<PlaceholderIcon />}
                  label="Overdue"
                  sublabel="3 tasks"
                  color="critical"
                />
                <IconTile
                  icon={<PlaceholderIcon />}
                  label="AI Suggestions"
                  sublabel="7 new"
                  color="accent"
                />
                <IconTile
                  icon={<PlaceholderIcon />}
                  label="Archived"
                  sublabel="56 items"
                  color="muted"
                />
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            SELECTION TILE
            ============================================================= */}
        <Section
          id="selection-tile"
          title="Selection Tile"
          description="Selectable card pattern — primary and accent variants"
        >
          <Card>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <SelectionTile
                  selected={selectedTile === "option-a"}
                  onClick={() => setSelectedTile("option-a")}
                  variant="primary"
                >
                  <p className="text-sm font-medium text-foreground">Option A</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Primary variant, currently selected.
                  </p>
                </SelectionTile>
                <SelectionTile
                  selected={selectedTile === "option-b"}
                  onClick={() => setSelectedTile("option-b")}
                  variant="accent"
                >
                  <p className="text-sm font-medium text-foreground">Option B</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Accent variant — click to select.
                  </p>
                </SelectionTile>
                <SelectionTile disabled>
                  <p className="text-sm font-medium text-foreground">Disabled</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This option is disabled.
                  </p>
                </SelectionTile>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            SECTION HEADER
            ============================================================= */}
        <Section
          id="section-header"
          title="Section Header"
          description="Heading levels h1–h4 with optional description and action slot"
        >
          <Card>
            <CardContent className="space-y-6">
              <SectionHeader as="h1" title="Heading 1" description="2xl bold with description" />
              <SectionHeader as="h2" title="Heading 2" description="xl semibold with description" />
              <SectionHeader
                as="h3"
                title="Heading 3"
                action={<Button size="sm" variant="secondary">Action</Button>}
              />
              <SectionHeader as="h4" title="Heading 4 — smallest" />
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            TOGGLE GROUP
            ============================================================= */}
        <Section
          id="toggle-group"
          title="Toggle Group"
          description="Radio-like button group with context-based state"
        >
          <Card>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">View mode</p>
                <ToggleGroup defaultValue="board">
                  <ToggleGroupItem value="board">Board</ToggleGroupItem>
                  <ToggleGroupItem value="list">List</ToggleGroupItem>
                  <ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">With disabled item</p>
                <ToggleGroup defaultValue="week">
                  <ToggleGroupItem value="day">Day</ToggleGroupItem>
                  <ToggleGroupItem value="week">Week</ToggleGroupItem>
                  <ToggleGroupItem value="month" disabled>Month</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            TABS
            ============================================================= */}
        <Section
          id="tabs"
          title="Tabs"
          description="Compound tab primitive — TabsList, TabsTrigger, TabsContent"
        >
          <Card>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="disabled" disabled>
                    Disabled
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <p className="text-sm text-muted-foreground">
                    Overview tab content. This panel is rendered conditionally.
                  </p>
                </TabsContent>
                <TabsContent value="activity">
                  <p className="text-sm text-muted-foreground">
                    Activity feed would go here.
                  </p>
                </TabsContent>
                <TabsContent value="settings">
                  <p className="text-sm text-muted-foreground">
                    Settings panel content.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            TABLE
            ============================================================= */}
        <Section
          id="table"
          title="Table"
          description="Compound table — Table, TableHeader, TableBody, TableRow, TableHead, TableCell"
        >
          <Card noPadding>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Auth flow redesign", status: "success", priority: "High", points: 8 },
                  { name: "API rate limiting", status: "warning", priority: "Medium", points: 5 },
                  { name: "Fix broken tests", status: "critical", priority: "Urgent", points: 3 },
                  { name: "Dashboard layout", status: "default", priority: "Low", points: 13 },
                ].map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant={row.status as any} dot>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.priority}</TableCell>
                    <TableCell className="text-right">{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Section>

        {/* =============================================================
            DROPDOWN
            ============================================================= */}
        <Section
          id="dropdown"
          title="Dropdown"
          description="Popover menu — Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSeparator"
        >
          <Card>
            <CardContent>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="secondary" size="sm">
                    Open Menu ▾
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Duplicate</DropdownItem>
                  <DropdownItem disabled>Archive (disabled)</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem critical>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            MODAL
            ============================================================= */}
        <Section
          id="modal"
          title="Modal"
          description="Dialog overlay — native <dialog> with focus trap and Escape dismiss"
        >
          <Card>
            <CardContent>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalOpen(true)}
              >
                Open Modal
              </Button>
              <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Sample Modal"
              >
                <p className="text-sm text-muted-foreground">
                  This is a modal dialog. Press <kbd className="px-1.5 py-0.5 rounded bg-surface-sunken border border-border text-xs font-mono">Esc</kbd> or click the × to close.
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setModalOpen(false)}>
                    Confirm
                  </Button>
                </div>
              </Modal>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            TOAST
            ============================================================= */}
        <Section
          id="toast"
          title="Toast"
          description="Variants: default, success, warning, critical · Auto-dismiss with configurable duration"
        >
          <Card>
            <CardContent className="space-y-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setToastVisible(true)}
              >
                Show Toasts
              </Button>

              {toastVisible && (
                <div className="flex flex-col gap-3 max-w-sm">
                  <Toast variant="default" onDismiss={() => {}} duration={0}>
                    Default notification message.
                  </Toast>
                  <Toast variant="success" onDismiss={() => {}} duration={0}>
                    Operation completed successfully!
                  </Toast>
                  <Toast variant="warning" onDismiss={() => {}} duration={0}>
                    Approaching storage limit.
                  </Toast>
                  <Toast
                    variant="critical"
                    onDismiss={() => setToastVisible(false)}
                    duration={0}
                  >
                    Failed to save — click × to dismiss all.
                  </Toast>
                </div>
              )}
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            SKELETON
            ============================================================= */}
        <Section
          id="skeleton"
          title="Skeleton"
          description="Loading placeholders — rectangle and circle variants"
        >
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <Skeleton circle className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* =============================================================
            BENTO GRID
            ============================================================= */}
        <Section
          id="bento-grid"
          title="Bento Grid"
          description="Responsive grid layout — BentoGrid (columns: 2|3|4|6) + BentoCell (colSpan, rowSpan)"
        >
          <BentoGrid columns={4} gap="md">
            <BentoCell colSpan={2}>
              <Card className="h-full">
                <CardContent>
                  <p className="text-sm font-medium text-foreground">colSpan=2</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Takes 2 of 4 columns on desktop.
                  </p>
                </CardContent>
              </Card>
            </BentoCell>
            <BentoCell>
              <Card className="h-full">
                <CardContent>
                  <p className="text-sm font-medium text-foreground">colSpan=1</p>
                </CardContent>
              </Card>
            </BentoCell>
            <BentoCell>
              <Card className="h-full">
                <CardContent>
                  <p className="text-sm font-medium text-foreground">colSpan=1</p>
                </CardContent>
              </Card>
            </BentoCell>
            <BentoCell colSpan={3}>
              <Card className="h-full">
                <CardContent>
                  <p className="text-sm font-medium text-foreground">colSpan=3</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Wide cell spanning 3 columns.
                  </p>
                </CardContent>
              </Card>
            </BentoCell>
            <BentoCell rowSpan={2}>
              <Card className="h-full">
                <CardContent>
                  <p className="text-sm font-medium text-foreground">rowSpan=2</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tall cell spanning 2 rows.
                  </p>
                </CardContent>
              </Card>
            </BentoCell>
            <BentoCell colSpan={2}>
              <Card className="h-full">
                <CardContent>
                  <p className="text-sm font-medium text-foreground">colSpan=2</p>
                </CardContent>
              </Card>
            </BentoCell>
            <BentoCell>
              <Card className="h-full">
                <CardContent>
                  <p className="text-sm font-medium text-foreground">colSpan=1</p>
                </CardContent>
              </Card>
            </BentoCell>
          </BentoGrid>
        </Section>

        {/* =============================================================
            THEME TOGGLE
            ============================================================= */}
        <Section
          id="theme-toggle"
          title="Theme Toggle"
          description="Cycles through light → dark → system. Verify all tokens change correctly."
        >
          <Card>
            <CardContent>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <p className="text-sm text-muted-foreground">
                  Click to cycle themes and verify the design tokens above.
                </p>
              </div>
            </CardContent>
          </Card>
        </Section>
      </div>
    </PageContainer>
  );
}

/* ---------------------------------------------------------------------------
   Placeholder icon (inline SVG so we don't require lucide-react)
   --------------------------------------------------------------------------- */
function PlaceholderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}
