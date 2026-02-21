"use client";

import { cn } from "@/lib/utils";
import Card from "@/components/ui/card";
import { Badge, Button, SelectionTile } from "@/components/ui";
import { StepIndicator, ClockIcon } from "./team-identity-card";
import type { SetupModule } from "../types";

/* -----------------------------------------------------------------------
   MODULES CARD — Tall card for selecting workspace modules
   Maps to HTML Card 2: "Workspace Modules" (5 cols, 2 rows)
   ----------------------------------------------------------------------- */

interface ModulesCardProps {
  modules: SetupModule[];
  onToggle: (moduleId: string) => void;
  completed: boolean;
}

const moduleIcons: Record<string, React.ReactNode> = {
  crm: <LayoutDashboardIcon />,
  chat: <MessageSquareIcon />,
  docs: <FileTextIcon />,
};

export default function ModulesCard({
  modules,
  onToggle,
  completed,
}: ModulesCardProps) {
  return (
    <Card
      className="flex flex-col bg-accent-muted/20"
      variant="accent"
    >
      {/* Top bar */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="critical">Critical</Badge>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <ClockIcon />
            <span className="text-[11px] font-medium">5 min</span>
          </span>
        </div>
        <StepIndicator completed={completed} />
      </div>

      {/* Title */}
      <h2 className="mb-2 text-xl font-bold text-foreground">
        Workspace Modules
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Select the core features your team will use on a daily basis.
      </p>

      {/* Module tiles */}
      <div className="flex-1 space-y-3">
        {modules.map((mod) => (
          <SelectionTile
            key={mod.id}
            selected={mod.enabled}
            variant="primary"
            onClick={() => onToggle(mod.id)}
            className="flex items-center justify-between !p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  mod.enabled
                    ? "bg-primary-muted text-primary"
                    : "bg-surface-sunken text-muted-foreground"
                )}
              >
                {moduleIcons[mod.icon] ?? <LayoutDashboardIcon />}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {mod.label}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {mod.description}
                </p>
              </div>
            </div>
            {mod.enabled ? (
              <CheckCircleIcon />
            ) : (
              <div className="h-5 w-5 rounded-full border border-border" />
            )}
          </SelectionTile>
        ))}
      </div>

      {/* View all */}
      <button
        type="button"
        className={cn(
          "mt-8 flex w-full items-center justify-center gap-2 py-3",
          "text-xs font-bold uppercase tracking-widest",
          "text-muted-foreground transition-colors duration-fast hover:text-foreground"
        )}
      >
        View All 12 Modules
        <ArrowRightIcon />
      </button>
    </Card>
  );
}

/* -----------------------------------------------------------------------
   ICONS
   ----------------------------------------------------------------------- */

function LayoutDashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function MessageSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
