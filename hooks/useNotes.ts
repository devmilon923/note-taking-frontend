import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/services/note.service";
import { CreateNoteInput, UpdateNoteInput } from "@/types/note";
import { toast } from "sonner";
import { getErrorMessage } from "@/query/axios";

export const NOTES_QUERY_KEY = ["notes"] as const;

export function useNotes(page = 1, limit = 6) {
  return useQuery({
    queryKey: [...NOTES_QUERY_KEY, { page, limit }],
    queryFn: () => noteService.getNotes({ page, limit }),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: [...NOTES_QUERY_KEY, id],
    queryFn: () => noteService.getNoteById(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteInput) => noteService.createNote(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY });
      toast.success(response.message || "Note created successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteInput }) =>
      noteService.updateNote(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...NOTES_QUERY_KEY, variables.id] });
      toast.success(response.message || "Note updated successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY });
      toast.success(response.message || "Note deleted successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
