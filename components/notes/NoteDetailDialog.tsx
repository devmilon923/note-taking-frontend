"use client";

import React from "react";
import { Calendar, Clock, Edit3, FileText, Loader2 } from "lucide-react";
import { Note } from "@/types/note";
import { useNote } from "@/hooks/useNotes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NoteDetailDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (note: Note) => void;
}

export function NoteDetailDialog({
  note,
  open,
  onOpenChange,
  onEdit,
}: NoteDetailDialogProps) {
  // Invokes GET /notes/:id when the dialog is opened
  const { data: noteResponse, isLoading } = useNote(
    open && note ? note._id : "",
  );

  const activeNote = noteResponse?.data || note;

  if (!note) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
              <FileText className="h-4 w-4" />
              Note Details
            </div>
            {isLoading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            )}
          </div>
          <DialogTitle className="text-xl font-bold break-words">
            {activeNote?.title || note.title}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Created {formatDate(activeNote?.createdAt || note.createdAt)}
            </span>
            {activeNote?.updatedAt &&
              activeNote.updatedAt !== activeNote.createdAt && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Updated {formatDate(activeNote.updatedAt)}
                </span>
              )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 my-2 border-t pt-4">
          <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed break-words">
            {activeNote?.content || note.content}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            className="cursor-pointer gap-1.5"
            onClick={() => {
              onOpenChange(false);
              onEdit(activeNote || note);
            }}
          >
            <Edit3 className="h-4 w-4" />
            Edit Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
