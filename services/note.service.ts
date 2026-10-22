import api from "@/query/axios";
import {
  CreateNoteInput,
  NoteResponse,
  NotesResponse,
  UpdateNoteInput,
} from "@/types/note";

export const noteService = {

  async getNotes(params?: {
    page?: number;
    limit?: number;
    title?: string;
    searchQ?: string;
    search?: string;
  }): Promise<NotesResponse> {
    const response = await api.get<NotesResponse>("/notes", {
      params,
    });
    return response.data;
  },


  async getNoteById(id: string): Promise<NoteResponse> {
    const response = await api.get<NoteResponse>(`/notes/${id}`);
    return response.data;
  },

  async createNote(data: CreateNoteInput): Promise<NoteResponse> {
    const response = await api.post<NoteResponse>("/notes", data);
    return response.data;
  },


  async updateNote(id: string, data: UpdateNoteInput): Promise<NoteResponse> {
    const response = await api.patch<NoteResponse>(`/note/${id}`, data);
    return response.data;
  },


  async deleteNote(id: string): Promise<{ message: string; status: boolean }> {
    const response = await api.delete<{ message: string; status: boolean }>(
      `/note/${id}`,
    );
    return response.data;
  },
};
