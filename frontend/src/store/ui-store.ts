/* UI Store (Zustand) */

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
}

// TODO: Replace with Zustand create()
export const useUIStore = (): UIState => ({
  sidebarOpen: true,
  theme: "light",
});
