import axios from "axios";
import { getIsLoggedIn, setIsLoggedIn } from "@/lib/auth-storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor: Suppress private API calls if user is logged out in localStorage
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const url = config.url || "";
  const isPublicAuthEndpoint =
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/logout");

  if (!isPublicAuthEndpoint && !getIsLoggedIn()) {
    const controller = new AbortController();
    controller.abort("User is logged out: private API call suppressed");
    config.signal = controller.signal;
  }

  return config;
});

// Response interceptor: Clear localStorage on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle in the browser
    if (typeof window !== "undefined" && error.response?.status === 401) {
      setIsLoggedIn(false);

      const requestUrl = error.config?.url || "";
      const isAuthEndpoint =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/user/profile");

      const currentPath = window.location.pathname;
      const isPublicPage =
        currentPath.includes("/login") || currentPath.includes("/register");

      // Only redirect if session expired on a protected API request and user is not on an auth page
      if (!isAuthEndpoint && !isPublicPage) {
        const fullPath = `${window.location.pathname}${window.location.search}`;
        window.location.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
      }
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export default api;
