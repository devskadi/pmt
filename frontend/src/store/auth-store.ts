/* Auth Store (Zustand) */

interface AuthState {
  user: null;
  isAuthenticated: boolean;
}

// TODO: Replace with Zustand create()
export const useAuthStore = (): AuthState => ({
  user: null,
  isAuthenticated: false,
});
