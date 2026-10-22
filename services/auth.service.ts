import api from "@/query/axios";
import { ApiResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>("/auth/login", payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>(
      "/auth/register",
      payload,
    );
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>("/user/profile");
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    interests?: string[];
  }): Promise<ApiResponse<User>> {
    const response = await api.patch<ApiResponse<User>>("/user/profile", data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {}
  },
};
