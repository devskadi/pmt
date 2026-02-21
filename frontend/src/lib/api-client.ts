/* API Client */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// TODO: Replace with Axios instance with interceptors
export const apiClient = {
  baseURL: API_BASE_URL,
};

export default apiClient;
