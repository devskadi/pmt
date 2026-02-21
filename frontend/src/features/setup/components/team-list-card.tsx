"use client";

import { cn } from "@/lib/utils";
import Card from "@/components/ui/card";
import { Avatar, AvatarGroup, Button, SectionHeader } from "@/components/ui";
import type { SetupTeamMember } from "../types";

/* -----------------------------------------------------------------------
   TEAM LIST CARD — Initial team display with invite CTA
   Maps to HTML Card 6: "Initial Team" (9 cols)
   ----------------------------------------------------------------------- */

interface TeamListCardProps {
  members: SetupTeamMember[];
  pendingCount: number;
  onInvite?: () => void;
}

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

export default function TeamListCard({
  members,
  pendingCount,
  onInvite,
}: TeamListCardProps) {
  return (
    <Card>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Initial Team"
          description="Invite your core contributors to get started."
          as="h2"
        />
        <Button variant="primary" size="md" onClick={onInvite}>
          <UserPlusIcon />
          Invite Members
        </Button>
      </div>

      {/* Member grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface-sunken/50 p-3"
          >
            <Avatar
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatarSeed}`}
              alt={member.name}
              size="md"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">
                {member.name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {roleLabels[member.role] ?? member.role}
              </p>
            </div>
          </div>
        ))}

        {/* Add another CTA */}
        <button
          type="button"
          onClick={onInvite}
          className={cn(
            "group flex items-center justify-center gap-2 rounded-xl p-3",
            "border-2 border-dashed border-border",
            "text-muted-foreground transition-all duration-fast",
            "hover:border-primary hover:text-primary"
          )}
        >
          <PlusCircleIcon />
          <span className="text-sm font-medium">Add Another</span>
        </button>
      </div>

      {/* Footer: avatar group + pending */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <AvatarGroup
          avatars={members.map((m) => ({
            src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.avatarSeed}`,
            alt: m.name,
            fallback: m.name.charAt(0),
          }))}
          max={3}
          size="sm"
        />
        <p className="text-xs text-muted-foreground">
          Invited via bulk upload (CSV) pending approval.
          {pendingCount > 0 && ` ${pendingCount} pending.`}
        </p>
      </div>
    </Card>
  );
}

/* -----------------------------------------------------------------------
   ICONS
   ----------------------------------------------------------------------- */

function UserPlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-fast group-hover:scale-110"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
