"use client";

import React from "react";
import { Calendar, Edit3, Trash2, Eye } from "lucide-react";
import { Note } from "@/types/note";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export function NoteCard({ note, onView, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="flex flex-col justify-between border border-border/80 bg-card rounded-xl shadow-xs hover:shadow-sm hover:border-border transition-all duration-200 hover:-translate-y-0.5 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            onClick={() => onView(note)}
            className="text-base font-semibold leading-snug line-clamp-2 cursor-pointer hover:text-primary transition-colors"
          >
            {note.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(note.updatedAt || note.createdAt)}</span>
        </div>
      </CardHeader>

      <CardContent
        onClick={() => onView(note)}
        className="pb-3 cursor-pointer flex-1"
      >
        <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-wrap break-words">
          {note.content}
        </p>
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onView(note)}
          className="cursor-pointer gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <Eye className="h-3.5 w-3.5" />
          Read
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onEdit(note)}
            className="cursor-pointer gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-150"
            title="Edit note"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => onDelete(note)}
            className="cursor-pointer gap-1 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
            title="Delete note"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
