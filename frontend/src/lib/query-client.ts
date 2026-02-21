/* React Query Configuration */

// TODO: Initialize QueryClient with proper defaults
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
};
