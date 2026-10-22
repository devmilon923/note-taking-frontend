"use client";

import React, { useMemo, useState } from "react";
import { useAdminNotes, useDeleteNoteAdmin } from "@/hooks/useAdmin";
import { Note } from "@/types/note";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Loader2,
  Search,
  Trash2,
  User,
} from "lucide-react";

export function GlobalNotesTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const { data, isLoading, isError, refetch } = useAdminNotes(page, limit);

  const [searchQuery, setSearchQuery] = useState("");
  const deleteMutation = useDeleteNoteAdmin();

  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const notes = data?.data || [];
  const pagination = data?.pagination;

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q)
      );
    });
  }, [notes, searchQuery]);

  const confirmDeleteNote = () => {
    if (!noteToDelete) return;
    deleteMutation.mutate(noteToDelete._id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setNoteToDelete(null);
      },
    });
  };

  const handleOpenDelete = (note: Note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title, content, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">
            Endpoint: <code className="text-foreground">GET /notes</code>
          </span>
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 bg-card rounded-xl border border-border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Retrieving global notes database...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-card rounded-xl border border-border space-y-3">
          <p className="text-sm font-medium text-destructive">
            Failed to retrieve global notes.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2 bg-card rounded-xl border border-border">
          <FileSpreadsheet className="h-10 w-10 text-muted-foreground/60" />
          <p className="text-sm font-medium">No notes found</p>
          <p className="text-xs">
            {searchQuery
              ? "Try adjusting your search criteria."
              : "No notes exist in the system yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note._id}
              className="p-5 rounded-xl border border-border bg-card flex flex-col justify-between gap-4 hover:border-primary/40 transition-colors shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-base text-foreground line-clamp-1">
                    {note.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDelete(note)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer shrink-0"
                    title="Moderate: Delete Note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {note.content}
                </p>
              </div>

              {/* Note Metadata */}
              <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 font-mono truncate max-w-[200px]">
                  <User className="h-3 w-3 shrink-0" />
                  <span className="truncate">Author: {note.author}</span>
                </div>

                <div className="flex items-center gap-1 font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {pagination && pagination.totalData > 0 && (
        <div className="bg-card p-3.5 rounded-xl border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              Showing Page <span className="font-semibold text-foreground">{pagination.currentPage}</span> of{" "}
              <span className="font-semibold text-foreground">{pagination.totalPage}</span> (
              {pagination.totalData} total notes)
            </span>

            {/* Page Size Selector */}
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-border/80">
              <span className="text-[11px]">Per page:</span>
              {[4, 6, 12, 24].map((size) => (
                <Button
                  key={size}
                  variant={limit === size ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setLimit(size);
                    setPage(1);
                  }}
                  className="h-6 px-2 text-[10px] cursor-pointer"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.prevPage}
              className="h-7 px-2.5 text-xs gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.nextPage}
              className="h-7 px-2.5 text-xs gap-1 cursor-pointer"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Note (Admin Moderation)</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete note &quot;{noteToDelete?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteNote}
              disabled={deleteMutation.isPending}
              className="gap-2"
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
