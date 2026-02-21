"use client";

import { cn } from "@/lib/utils";
import Card from "@/components/ui/card";
import { StepIndicator, ClockIcon } from "./team-identity-card";
import type { SetupIntegration } from "../types";

/* -----------------------------------------------------------------------
   INTEGRATIONS CARD — Grid of integration icons to connect
   Maps to HTML Card 3: "Integrations" (4 cols)
   ----------------------------------------------------------------------- */

interface IntegrationsCardProps {
  integrations: SetupIntegration[];
  onToggle: (id: string) => void;
  completed: boolean;
}

const integrationLabels: Record<string, string> = {
  slack: "Slack",
  google: "Google",
  figma: "Figma",
  github: "GitHub",
  notion: "Notion",
  linear: "Linear",
};

export default function IntegrationsCard({
  integrations,
  onToggle,
  completed,
}: IntegrationsCardProps) {
  return (
    <Card className="flex flex-col">
      {/* Top bar */}
      <div className="mb-6 flex items-start justify-between">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <ClockIcon />
          <span className="text-[11px] font-medium">3 min</span>
        </span>
        <StepIndicator completed={completed} />
      </div>

      {/* Content */}
      <h2 className="mb-1 text-lg font-bold text-foreground">Integrations</h2>
      <p className="mb-6 text-xs text-muted-foreground">
        Connect your favorite tools.
      </p>

      {/* Integration grid */}
      <div className="grid grid-cols-3 gap-3">
        {integrations.map((integration) => (
          <button
            key={integration.id}
            type="button"
            onClick={() => onToggle(integration.id)}
            className={cn(
              "group flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5",
              "rounded-xl border bg-surface-sunken",
              "transition-all duration-fast",
              "hover:border-border-hover",
              integration.connected
                ? "border-primary bg-primary-muted"
                : "border-border"
            )}
            aria-label={`Connect ${integrationLabels[integration.icon] ?? integration.icon}`}
          >
            <IntegrationIcon
              name={integration.icon}
              connected={integration.connected}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                integration.connected
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {integrationLabels[integration.icon] ?? integration.icon}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

/* -----------------------------------------------------------------------
   INTEGRATION ICON — Placeholder letter-based icon
   (In production these would be actual brand SVGs loaded locally)
   ----------------------------------------------------------------------- */

function IntegrationIcon({
  name,
  connected,
}: {
  name: string;
  connected: boolean;
}) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
        "transition-all duration-fast",
        connected
          ? "text-primary"
          : "text-muted-foreground opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0"
      )}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
