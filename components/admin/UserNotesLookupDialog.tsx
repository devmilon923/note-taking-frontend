"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserNotesLookup, useDeleteNoteAdmin } from "@/hooks/useAdmin";
import {
  BookOpen,
  Calendar,
  FileText,
  Loader2,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { Note } from "@/types/note";

interface UserNotesLookupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  userName?: string;
  userEmail?: string;
}

export function UserNotesLookupDialog({
  open,
  onOpenChange,
  userId,
  userName,
  userEmail,
}: UserNotesLookupDialogProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useUserNotesLookup(
    open && userId ? userId : undefined,
    page,
    10,
  );

  const deleteNoteMutation = useDeleteNoteAdmin();
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const lookupData = data?.data;
  const user = lookupData?.user;
  const notes = lookupData?.notes || [];

  const handleDeleteNote = (noteId: string) => {
    deleteNoteMutation.mutate(noteId, {
      onSuccess: () => {
        setNoteToDelete(null);
        refetch();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                <span>User Notes Pipeline</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  $lookup
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Aggregated notes authored by{" "}
                <span className="font-semibold text-foreground">
                  {user?.name || userName || "User"}
                </span>{" "}
                ({user?.email || userEmail})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-sm">Fetching user notes via MongoDB aggregation...</p>
            </div>
          ) : isError ? (
            <div className="p-6 text-center text-sm text-destructive bg-destructive/10 rounded-xl">
              Unable to load notes for this user.
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <FileText className="h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm font-medium">No notes created yet</p>
              <p className="text-xs">
                This user has not authored any notes in the system.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Found {notes.length} note{notes.length === 1 ? "" : "s"}</span>
                <span className="font-mono">User ID: {userId}</span>
              </div>

              {notes.map((note) => (
                <div
                  key={note._id}
                  className="p-4 rounded-xl border border-border bg-card/60 hover:bg-card transition-colors space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-sm line-clamp-1">
                      {note.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note._id)}
                      disabled={deleteNoteMutation.isPending}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground/80 pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="h-3 w-3" />
                      {new Date(note.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-mono text-[10px] truncate max-w-[150px]">
                      ID: {note._id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
