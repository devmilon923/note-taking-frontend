import { z } from "zod";
import { User } from "./auth";
import { PaginationMeta } from "./note";

export type AdminUser = User;

export interface AdminUsersResponse {
  message: string;
  data: AdminUser[];
  pagination: PaginationMeta;
  status: boolean;
}

export interface AdminUserResponse {
  message: string;
  data: AdminUser;
  status: boolean;
}

/**
 * Validation schema for Admin creating a user:
 * - name: minimum 3 characters
 * - email: valid email
 * - password: minimum 6 characters
 * - role: "user" | "admin"
 * - interests: array of allowed interests
 */
export const createUserSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
  interests: z.array(z.string()).default([]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

/**
 * Validation schema for Admin updating a user:
 * - name: optional, minimum 3 characters
 * - role: optional "user" | "admin"
 * - interests: optional array of allowed interests
 */
export const updateUserSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").optional(),
  role: z.enum(["user", "admin"]).optional(),
  interests: z.array(z.string()).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export interface InterestUser {
  _id: string;
  name: string;
  email: string;
}

export interface InterestGroup {
  interest: string;
  count: number;
  users: InterestUser[];
}

export interface UserNotesLookupData {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  notes: {
    _id: string;
    title: string;
    content: string;
    author?: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

