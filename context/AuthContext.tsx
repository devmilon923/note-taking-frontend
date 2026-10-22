"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { ApiResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { getIsLoggedIn, setIsLoggedIn } from "@/lib/auth-storage";

export const AUTH_QUERY_KEY = ["auth", "profile"] as const;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<ApiResponse<User>>;
  register: (payload: RegisterPayload) => Promise<ApiResponse<User>>;
  logout: () => Promise<void>;
  refetchProfile: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Track localStorage login flag in state
  const [hasStoredSession, setHasStoredSession] = useState<boolean>(() =>
    getIsLoggedIn(),
  );

  useEffect(() => {
    setHasStoredSession(getIsLoggedIn());
  }, []);

  // 1. Fetch authenticated user profile via React Query
  // ONLY enabled if localStorage indicates the user is logged in
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        return await authService.getProfile();
      } catch (error: any) {
        const status = error.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          setIsLoggedIn(false);
          setHasStoredSession(false);
          return null;
        }
        throw error;
      }
    },
    enabled: hasStoredSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const user = hasStoredSession ? profileData?.data || null : null;
  const isAuthenticated = Boolean(hasStoredSession && user);
  const isLoading = hasStoredSession ? isProfileLoading : false;

  // 2. Login mutation
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setIsLoggedIn(true);
      setHasStoredSession(true);
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
    },
  });

  // 3. Register mutation
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });

  // 4. Logout mutation: clears localStorage and React Query caches
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onMutate: () => {
      setIsLoggedIn(false);
      setHasStoredSession(false);
      queryClient.cancelQueries();
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    },
    onSettled: () => {
      setIsLoggedIn(false);
      setHasStoredSession(false);
      queryClient.removeQueries();
      router.replace("/login");
    },
  });

  const login = useCallback(
    async (payload: LoginPayload) => {
      const result = await loginMutation.mutateAsync(payload);
      return result;
    },
    [loginMutation],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      return await registerMutation.mutateAsync(payload);
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    setIsLoggedIn(false);
    setHasStoredSession(false);
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      refetchProfile: refetch,
    }),
    [user, isLoading, isAuthenticated, login, register, logout, refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
