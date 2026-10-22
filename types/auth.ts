import { z } from "zod";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | string;
  interests?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  status: boolean;
  pagination?: {
    totalData: number;
    totalPage: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  interests: z.string().optional(), // Entered as comma-separated in the form, transformed on submit
});

export type RegisterInput = z.infer<typeof registerSchema>;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  interests?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}
