import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { CreateUserInput, UpdateUserInput } from "@/types/admin";
import { toast } from "sonner";
import { getErrorMessage } from "@/query/axios";

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  role?: "admin" | "user" | "all";
  searchQ?: string;
  search?: string;
}

export interface AdminNotesParams {
  page?: number;
  limit?: number;
  title?: string;
  searchQ?: string;
  author?: string;
}

export const ADMIN_KEYS = {
  users: (params?: AdminUsersParams) => ["admin", "users", params] as const,
  user: (id: string) => ["admin", "user", id] as const,
  notes: (params?: AdminNotesParams) => ["admin", "notes", params] as const,
  interests: ["admin", "interests"] as const,
  lookup: (userId: string, page = 1) =>
    ["admin", "lookup", userId, { page }] as const,
};

export function useAdminUsers(
  paramsOrPage: AdminUsersParams | number = 1,
  maybeLimit = 10,
) {
  const params: AdminUsersParams =
    typeof paramsOrPage === "number"
      ? { page: paramsOrPage, limit: maybeLimit }
      : paramsOrPage;

  return useQuery({
    queryKey: ADMIN_KEYS.users(params),
    queryFn: () => adminService.getUsers(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ADMIN_KEYS.user(id),
    queryFn: () => adminService.getUserById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useAdminNotes(
  paramsOrPage: AdminNotesParams | number = 1,
  maybeLimit = 10,
  maybeAuthor?: string,
) {
  const params: AdminNotesParams =
    typeof paramsOrPage === "number"
      ? { page: paramsOrPage, limit: maybeLimit, author: maybeAuthor }
      : paramsOrPage;

  return useQuery({
    queryKey: ADMIN_KEYS.notes(params),
    queryFn: () => adminService.getAllNotes(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export function useUserInterests() {
  return useQuery({
    queryKey: ADMIN_KEYS.interests,
    queryFn: () => adminService.getUserInterests(),
    staleTime: 60 * 1000,
  });
}

export function useUserNotesLookup(userId?: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: ADMIN_KEYS.lookup(userId || "", page),
    queryFn: () =>
      adminService.getUserNotesLookup(userId || "", { page, limit }),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => adminService.createUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.interests });
      toast.success(response.message || "User created successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      adminService.updateUser(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.user(variables.id) });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.interests });
      toast.success(response.message || "User updated successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "notes"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.interests });
      toast.success(response.message || "User and associated notes deleted!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteNoteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteNoteAdmin(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(response.message || "Note deleted successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
