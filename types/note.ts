import { z } from "zod";

export interface Note {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalData: number;
  totalPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface NotesResponse {
  message: string;
  data: Note[];
  pagination: PaginationMeta;
  status: boolean;
}

export interface NoteResponse {
  message: string;
  data: Note;
  status: boolean;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

/**
 * Zod validation matching backend constraints:
 * - title: 3 to 50 characters
 * - content: minimum 10 characters
 */
export const noteFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be between 3 and 50 characters")
    .max(50, "Title cannot exceed 50 characters"),
  content: z
    .string()
    .trim()
    .min(10, "Content must be at least 10 characters"),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
