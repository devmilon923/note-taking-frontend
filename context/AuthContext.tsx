"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { ApiResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";
import { useRouter } from "next/navigation";

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

  // 1. Fetch authenticated user profile via React Query
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        return await authService.getProfile();
      } catch (error: any) {
        // Treat 401 (unauthorized) and 403/404 as unauthenticated rather than fatal errors
        const status = error.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const user = profileData?.data || null;
  const isAuthenticated = !!user;

  // 2. Login mutation
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data);
    },
  });

  // 3. Register mutation (does not set profile cache since login sets the JWT cookie)
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });

  // 4. Logout mutation: clears cache and uses replace to prevent back-button loops
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries();
      router.replace("/login");
    },
  });

  const login = useCallback(
    async (payload: LoginPayload) => {
      return await loginMutation.mutateAsync(payload);
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
