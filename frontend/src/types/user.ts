/* User Types */

export type UserRole = "admin" | "pm" | "developer" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  avatar_url?: string;
}

export interface UserSummary {
  id: string;
  name: string;
  role: UserRole;
}
