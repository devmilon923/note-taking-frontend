"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Note } from "@/types/note";
import { useDeleteNote } from "@/hooks/useNotes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteNoteDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteNoteDialog({
  note,
  open,
  onOpenChange,
}: DeleteNoteDialogProps) {
  const deleteMutation = useDeleteNote();
  const isDeleting = deleteMutation.isPending;

  const handleDelete = async () => {
    if (!note) return;
    try {
      await deleteMutation.mutateAsync(note._id);
      onOpenChange(false);
    } catch {
      // Error handled by mutation onError toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
            <Trash2 className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-lg">Delete Note</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{note?.title}&quot;
            </span>
            ? This action will remove the note from your workspace.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 sm:justify-center mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Note"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
