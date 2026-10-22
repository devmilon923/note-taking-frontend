import api from "@/query/axios";
import {
  AdminUserResponse,
  AdminUsersResponse,
  CreateUserInput,
  UpdateUserInput,
} from "@/types/admin";
import { NotesResponse } from "@/types/note";

export const adminService = {
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: "admin" | "user" | "all";
    searchQ?: string;
    search?: string;
  }): Promise<AdminUsersResponse> {
    const response = await api.get<AdminUsersResponse>("/users", {
      params,
    });
    return response.data;
  },

  async getUserById(id: string): Promise<AdminUserResponse> {
    const response = await api.get<AdminUserResponse>(`/user/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserInput): Promise<AdminUserResponse> {
    const response = await api.post<AdminUserResponse>("/user", data);
    return response.data;
  },

  async updateUser(
    id: string,
    data: UpdateUserInput,
  ): Promise<AdminUserResponse> {
    const response = await api.patch<AdminUserResponse>(`/user/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string; status: boolean }> {
    const response = await api.delete<{ message: string; status: boolean }>(
      `/user/${id}`,
    );
    return response.data;
  },

  async getAllNotes(params?: {
    page?: number;
    limit?: number;
    title?: string;
    searchQ?: string;
    author?: string;
  }): Promise<NotesResponse> {
    const response = await api.get<NotesResponse>("/notes", {
      params,
    });
    return response.data;
  },

  async deleteNoteAdmin(
    id: string,
  ): Promise<{ message: string; status: boolean }> {
    const response = await api.delete<{ message: string; status: boolean }>(
      `/note/${id}`,
    );
    return response.data;
  },

  async getUserInterests(): Promise<{
    message: string;
    data: import("@/types/admin").InterestGroup[];
    status: boolean;
  }> {
    const response = await api.get<{
      message: string;
      data: import("@/types/admin").InterestGroup[];
      status: boolean;
    }>("/user/interests");
    return response.data;
  },

  async getUserNotesLookup(
    userId: string,
    params?: { page?: number; limit?: number },
  ): Promise<{
    message: string;
    data: import("@/types/admin").UserNotesLookupData;
    status: boolean;
  }> {
    const response = await api.get<{
      message: string;
      data: import("@/types/admin").UserNotesLookupData;
      status: boolean;
    }>(`/user/notes/${userId}`, { params });
    return response.data;
  },
};
