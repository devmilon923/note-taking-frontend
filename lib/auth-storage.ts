const AUTH_STORAGE_KEY = "isLoggedIn";

/**
 * Check whether the user is marked as logged in according to localStorage
 */
export const getIsLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

/**
 * Persist the logged in state to localStorage
 */
export const setIsLoggedIn = (loggedIn: boolean): void => {
  if (typeof window === "undefined") return;
  try {
    if (loggedIn) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {}
};
