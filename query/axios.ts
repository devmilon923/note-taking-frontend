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

export const getFieldErrors = (error: unknown): Record<string, string> => {
  if (!axios.isAxiosError(error)) return {};

  const resData = error.response?.data;
  if (!resData || typeof resData !== "object") return {};

  const errorData = (resData as any).data;
  if (!errorData) return {};

  const result: Record<string, string> = {};

  // Case 1: Formatted Zod object, e.g. { password: { _errors: ["Password must be at least 6 characters long"] } }
  if (typeof errorData === "object" && !Array.isArray(errorData)) {
    for (const [key, value] of Object.entries(errorData)) {
      if (key === "_errors" && Array.isArray(value) && value.length > 0) {
        result.root = String(value[0]);
      } else if (value && typeof value === "object") {
        if (
          "_errors" in value &&
          Array.isArray((value as any)._errors) &&
          (value as any)._errors.length > 0
        ) {
          result[key] = String((value as any)._errors[0]);
        } else if (Array.isArray(value) && value.length > 0) {
          result[key] = String(value[0]);
        } else if (typeof value === "string") {
          result[key] = value;
        }
      }
    }
  }

  // Case 2: Array of Zod issues, e.g. [{ path: ["password"], message: "..." }]
  if (Array.isArray(errorData)) {
    for (const issue of errorData) {
      if (issue && typeof issue === "object") {
        const fieldName =
          Array.isArray(issue.path) && issue.path.length > 0
            ? String(issue.path[0])
            : "root";
        if (issue.message && !result[fieldName]) {
          result[fieldName] = String(issue.message);
        }
      }
    }
  }

  return result;
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const resData = error.response?.data;

    // Check if there are specific field errors in data
    const fieldErrors = getFieldErrors(error);
    const fieldMessages = Object.entries(fieldErrors).map(([field, msg]) => {
      if (field === "root") return msg;
      const label = field.charAt(0).toUpperCase() + field.slice(1);
      return `${label}: ${msg}`;
    });

    if (fieldMessages.length > 0) {
      return fieldMessages.join(" • ");
    }

    // If message is generic "Zod validation error" but no field errors were parsed
    if (resData?.message === "Zod validation error") {
      return "Please review the form fields and correct the highlighted errors.";
    }

    return (
      resData?.message ||
      resData?.error ||
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
