/* Workspace Setup Types */

export interface SetupModule {
  id: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface SetupTeamMember {
  id: string;
  name: string;
  role: "owner" | "admin" | "member";
  avatarSeed: string;
}

export interface SetupIntegration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
}

export type SetupVisibility = "private" | "public";

export interface SetupProgress {
  completed: number;
  total: number;
}

export interface WorkspaceSetupState {
  workspaceName: string;
  visibility: SetupVisibility;
  region: string;
  modules: SetupModule[];
  members: SetupTeamMember[];
  integrations: SetupIntegration[];
}
