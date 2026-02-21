"use client";

import Card from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui";
import { StepIndicator } from "./team-identity-card";
import type { SetupVisibility } from "../types";

/* -----------------------------------------------------------------------
   VISIBILITY CARD — Private/Public workspace toggle
   Maps to HTML Card 4: "Visibility" (3 cols)
   ----------------------------------------------------------------------- */

interface VisibilityCardProps {
  visibility: SetupVisibility;
  onChange: (v: SetupVisibility) => void;
  completed: boolean;
}

export default function VisibilityCard({
  visibility,
  onChange,
  completed,
}: VisibilityCardProps) {
  return (
    <Card className="flex flex-col justify-between bg-primary-muted/20">
      {/* Top bar */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted text-primary">
          <EyeIcon />
        </div>
        <StepIndicator completed={completed} />
      </div>

      {/* Content */}
      <div>
        <h2 className="mb-1 text-base font-bold text-foreground">
          Visibility
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Workspace is {visibility === "private" ? "Private" : "Public"}
        </p>

        <ToggleGroup
          defaultValue={visibility}
          value={visibility}
          onValueChange={(v) => onChange(v as SetupVisibility)}
          className="w-full"
        >
          <ToggleGroupItem value="private" className="flex-1">
            Private
          </ToggleGroupItem>
          <ToggleGroupItem value="public" className="flex-1">
            Public
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Card>
  );
}

function EyeIcon() {
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
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
