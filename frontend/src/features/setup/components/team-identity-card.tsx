"use client";

import { cn } from "@/lib/utils";
import Card from "@/components/ui/card";
import { Badge, Input } from "@/components/ui";

/* -----------------------------------------------------------------------
   TEAM IDENTITY CARD — Logo upload + workspace name input
   Maps to HTML Card 1: "Team Identity" (7 cols)
   ----------------------------------------------------------------------- */

interface TeamIdentityCardProps {
  workspaceName: string;
  onNameChange: (name: string) => void;
  completed: boolean;
}

export default function TeamIdentityCard({
  workspaceName,
  onNameChange,
  completed,
}: TeamIdentityCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      {/* Top bar: badge + time + completion */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="default">Recommended</Badge>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <ClockIcon />
            <span className="text-[11px] font-medium">2 min</span>
          </span>
        </div>
        <StepIndicator completed={completed} />
      </div>

      {/* Content */}
      <div>
        <h2 className="mb-2 text-xl font-bold text-foreground">
          Team Identity
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Set your name, logo, and brand colors to personalize your space.
        </p>

        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Logo upload placeholder */}
          <div
            className={cn(
              "flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl",
              "border-2 border-dashed border-border bg-surface-sunken",
              "transition-colors duration-fast",
              "hover:border-primary group"
            )}
          >
            <UploadIcon />
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              Logo
            </span>
          </div>

          {/* Name input */}
          <div className="w-full flex-1">
            <label className="mb-1.5 block text-[11px] font-bold uppercase text-muted-foreground">
              Workspace Name
            </label>
            <Input
              placeholder="Acme Design Co."
              value={workspaceName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* -----------------------------------------------------------------------
   SHARED MICRO-COMPONENTS
   ----------------------------------------------------------------------- */

function StepIndicator({ completed }: { completed: boolean }) {
  return completed ? (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-success-foreground"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
  ) : (
    <div className="h-5 w-5 rounded-full border-2 border-border" />
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UploadIcon() {
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
      className="mb-1 text-muted-foreground group-hover:text-primary transition-colors duration-fast"
      aria-hidden="true"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

export { StepIndicator, ClockIcon };
