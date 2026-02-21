"use client";

import Card from "@/components/ui/card";
import { Button } from "@/components/ui";
import { StepIndicator } from "./team-identity-card";

/* -----------------------------------------------------------------------
   REGION CARD — Timezone/region setting
   Maps to HTML Card 5: "Region" (3 cols)
   ----------------------------------------------------------------------- */

interface RegionCardProps {
  region: string;
  onChangeRegion?: () => void;
  completed: boolean;
}

export default function RegionCard({
  region,
  onChangeRegion,
  completed,
}: RegionCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-sunken text-muted-foreground">
          <GlobeIcon />
        </div>
        <StepIndicator completed={completed} />
      </div>

      {/* Content */}
      <div>
        <h2 className="mb-1 text-base font-bold text-foreground">Region</h2>
        <p className="mb-4 text-xs text-muted-foreground">{region}</p>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onChangeRegion}
        >
          Change
        </Button>
      </div>
    </Card>
  );
}

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
