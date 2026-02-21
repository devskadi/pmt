/* Application Constants */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  TASKS: "/tasks",
  ADMIN: "/admin",
  SETTINGS: "/settings",
} as const;

export const ROLES = {
  ADMIN: "admin",
  PM: "pm",
  DEVELOPER: "developer",
  VIEWER: "viewer",
} as const;
