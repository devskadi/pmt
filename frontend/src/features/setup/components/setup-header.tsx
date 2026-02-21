"use client";

import { cn } from "@/lib/utils";
import { ProgressRing, Badge, Button } from "@/components/ui";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import type { SetupProgress } from "../types";

/* -----------------------------------------------------------------------
   SETUP HEADER — Breadcrumb nav, title, progress ring, skip/finish CTA
   ----------------------------------------------------------------------- */

interface SetupHeaderProps {
  progress: SetupProgress;
  canFinish: boolean;
  onSkip?: () => void;
  onFinish?: () => void;
}

export default function SetupHeader({
  progress,
  canFinish,
  onSkip,
  onFinish,
}: SetupHeaderProps) {
  const pct = Math.round((progress.completed / progress.total) * 100);

  return (
    <header className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
      {/* Left: Breadcrumb + title + description */}
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            { label: "Setup Guide", href: "#" },
            { label: "Workspace" },
          ]}
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Workspace Setup{" "}
          <span className="font-light text-foreground-subtle">
            / Build your foundation
          </span>
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
          Configure your environment to match your team&apos;s workflow.
          Complete these modules to unlock the full potential of your new
          workspace.
        </p>
      </div>

      {/* Right: Progress + actions */}
      <div
        className={cn(
          "flex items-center gap-8 rounded-2xl border border-border bg-surface/50 p-4",
          "backdrop-blur-sm"
        )}
      >
        {/* Progress ring */}
        <div className="flex items-center gap-4">
          <ProgressRing
            value={pct}
            size={56}
            strokeWidth={3}
            variant="success"
          />
          <div>
            <p className="text-xs font-bold uppercase text-foreground">
              Progress
            </p>
            <p className="text-xs text-muted-foreground">
              {progress.completed} of {progress.total} modules done
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-medium text-muted-foreground transition-colors duration-fast hover:text-foreground"
          >
            Skip
          </button>
          <Button
            variant="primary"
            size="md"
            disabled={!canFinish}
          >
            Finish Setup
          </Button>
        </div>
      </div>
    </header>
  );
}
