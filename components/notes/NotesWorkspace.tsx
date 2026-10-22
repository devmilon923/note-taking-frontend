"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

import { Note } from "@/types/note";
import { useNotes } from "@/hooks/useNotes";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteFormDialog } from "@/components/notes/NoteFormDialog";
import { DeleteNoteDialog } from "@/components/notes/DeleteNoteDialog";
import { NoteDetailDialog } from "@/components/notes/NoteDetailDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useDebounce } from "@/hooks/useDebounce";

export function NotesWorkspace() {
  const [page, setPage] = useState(1);
  const limit = 6;
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Reset page to 1 when search query changes
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // React Query for fetching paginated notes with server-side title search
  const { data, isLoading, isPlaceholderData } = useNotes({
    page,
    limit,
    searchQ: debouncedSearch.trim() || undefined,
  });

  // Modal dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [noteToView, setNoteToView] = useState<Note | null>(null);

  const notes = data?.data || [];
  const pagination = data?.pagination;

  const handleOpenCreate = () => {
    setNoteToEdit(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setNoteToEdit(note);
    setFormOpen(true);
  };

  const handleOpenDelete = (note: Note) => {
    setNoteToDelete(note);
    setDeleteOpen(true);
  };

  const handleOpenView = (note: Note) => {
    setNoteToView(note);
    setViewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {pagination && (
            <span className="text-xs text-muted-foreground font-medium hidden md:inline">
              Total {pagination.totalData} {pagination.totalData === 1 ? "note" : "notes"}
            </span>
          )}
          <Button onClick={handleOpenCreate} className="gap-1.5 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </Button>
        </div>
      </div>

      {/* Notes Grid / States */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your notes...
          </p>
        </div>
      ) : notes.length === 0 ? (
        <div className="min-h-[320px] rounded-3xl border border-dashed border-border bg-card/50 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <FileText className="h-7 w-7" />
          </div>
          {searchQuery ? (
            <>
              <h3 className="text-lg font-semibold">No notes match your search</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                No notes found matching &quot;{searchQuery}&quot;. Try adjusting your search term.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">No notes yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                Your workspace is empty. Create your first note to start organizing thoughts and ideas.
              </p>
              <Button onClick={handleOpenCreate} className="mt-4 gap-1.5 cursor-pointer">
                <Plus className="h-4 w-4" />
                Create First Note
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalData > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="text-xs text-muted-foreground">
            Page <span className="font-semibold text-foreground">{pagination.currentPage}</span> of{" "}
            <span className="font-semibold text-foreground">{pagination.totalPage}</span> (
            {pagination.totalData} total notes)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={!pagination.prevPage || isPlaceholderData}
              className="gap-1 text-xs cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (pagination.nextPage) {
                  setPage(pagination.nextPage);
                }
              }}
              disabled={!pagination.nextPage || isPlaceholderData}
              className="gap-1 text-xs cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <NoteFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        noteToEdit={noteToEdit}
      />

      <DeleteNoteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        note={noteToDelete}
      />

      <NoteDetailDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        note={noteToView}
        onEdit={handleOpenEdit}
      />
    </div>
  );
}
