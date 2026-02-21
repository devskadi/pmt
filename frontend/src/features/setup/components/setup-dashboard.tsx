"use client";

import { useState, useCallback } from "react";
import BentoGrid, { BentoCell } from "@/components/layout/bento-grid";
import PageContainer from "@/components/layout/page-container";
import Footer from "@/components/layout/footer";
import SetupHeader from "./setup-header";
import TeamIdentityCard from "./team-identity-card";
import ModulesCard from "./modules-card";
import IntegrationsCard from "./integrations-card";
import VisibilityCard from "./visibility-card";
import RegionCard from "./region-card";
import TeamListCard from "./team-list-card";
import type {
  SetupModule,
  SetupTeamMember,
  SetupIntegration,
  SetupVisibility,
} from "../types";

/* -----------------------------------------------------------------------
   SETUP DASHBOARD — Client-side orchestrator for workspace setup flow
   
   Manages local state for all setup cards and composes them into
   a BentoGrid layout matching the static HTML reference.
   ----------------------------------------------------------------------- */

const INITIAL_MODULES: SetupModule[] = [
  {
    id: "crm",
    label: "Project CRM",
    description: "Client & deal tracking",
    icon: "crm",
    enabled: true,
  },
  {
    id: "chat",
    label: "Team Chat",
    description: "Internal communication",
    icon: "chat",
    enabled: true,
  },
  {
    id: "docs",
    label: "Docs & Wiki",
    description: "Centralized knowledge",
    icon: "docs",
    enabled: false,
  },
];

const INITIAL_MEMBERS: SetupTeamMember[] = [
  { id: "1", name: "Alex Rivera", role: "owner", avatarSeed: "Felix" },
  { id: "2", name: "Jordan Smith", role: "admin", avatarSeed: "Jordan" },
];

const INITIAL_INTEGRATIONS: SetupIntegration[] = [
  { id: "slack", name: "Slack", icon: "slack", connected: false },
  { id: "google", name: "Google", icon: "google", connected: false },
  { id: "figma", name: "Figma", icon: "figma", connected: false },
];

export default function SetupDashboard() {
  /* ---- State ---- */
  const [workspaceName, setWorkspaceName] = useState("");
  const [visibility, setVisibility] = useState<SetupVisibility>("private");
  const [modules, setModules] = useState<SetupModule[]>(INITIAL_MODULES);
  const [members] = useState<SetupTeamMember[]>(INITIAL_MEMBERS);
  const [integrations, setIntegrations] =
    useState<SetupIntegration[]>(INITIAL_INTEGRATIONS);

  /* ---- Handlers ---- */
  const toggleModule = useCallback((id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  }, []);

  const toggleIntegration = useCallback((id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, connected: !i.connected } : i
      )
    );
  }, []);

  /* ---- Completion state ---- */
  const nameCompleted = workspaceName.trim().length > 0;
  const modulesCompleted = modules.some((m) => m.enabled);
  const integrationsCompleted = integrations.some((i) => i.connected);
  const completedCount = [
    nameCompleted,
    modulesCompleted,
    integrationsCompleted,
    true, // visibility always "completed"
    false, // region not yet changeable
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <PageContainer size="lg">
        <div className="py-6 lg:py-12">
          {/* Header */}
          <div className="mb-12">
            <SetupHeader
              progress={{ completed: completedCount, total: 5 }}
              canFinish={completedCount >= 4}
            />
          </div>

          {/* Main Bento Grid — 12-column layout */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 auto-rows-min">
            {/* Row 1, Left: Team Identity (7 cols) */}
            <div className="md:col-span-7">
              <TeamIdentityCard
                workspaceName={workspaceName}
                onNameChange={setWorkspaceName}
                completed={nameCompleted}
              />
            </div>

            {/* Row 1-2, Right: Modules (5 cols, spans 2 rows) */}
            <div className="md:col-span-5 md:row-span-2">
              <ModulesCard
                modules={modules}
                onToggle={toggleModule}
                completed={modulesCompleted}
              />
            </div>

            {/* Row 2, Left: Integrations (4 cols) */}
            <div className="md:col-span-4">
              <IntegrationsCard
                integrations={integrations}
                onToggle={toggleIntegration}
                completed={integrationsCompleted}
              />
            </div>

            {/* Row 2, Middle: Visibility (3 cols) */}
            <div className="md:col-span-3">
              <VisibilityCard
                visibility={visibility}
                onChange={setVisibility}
                completed={true}
              />
            </div>

            {/* Row 3: Region (3 cols) — extends below Modules */}
            <div className="md:col-span-3">
              <RegionCard
                region="UTC-08:00 (Pacific)"
                completed={false}
              />
            </div>

            {/* Row 3: Team List (9 cols) */}
            <div className="md:col-span-9">
              <TeamListCard
                members={members}
                pendingCount={12}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12">
            <Footer text="© 2024 Workspace Orchestrator. All configurations are stored securely." />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
