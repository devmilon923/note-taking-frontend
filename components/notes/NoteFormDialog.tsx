"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { Loader2, Plus, Edit3 } from "lucide-react";

import { Note, noteFormSchema, NoteFormValues } from "@/types/note";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { getFieldErrors } from "@/query/axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteToEdit?: Note | null;
}

export function NoteFormDialog({
  open,
  onOpenChange,
  noteToEdit,
}: NoteFormDialogProps) {
  const isEditing = Boolean(noteToEdit);
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (noteToEdit) {
        form.reset({
          title: noteToEdit.title,
          content: noteToEdit.content,
        });
      } else {
        form.reset({
          title: "",
          content: "",
        });
      }
    }
  }, [open, noteToEdit, form]);

  const onSubmit = async (values: NoteFormValues) => {
    try {
      if (isEditing && noteToEdit) {
        await updateMutation.mutateAsync({
          id: noteToEdit._id,
          data: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          form.setError(field as any, {
            type: "server",
            message: msg,
          });
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {isEditing ? (
              <>
                <Edit3 className="h-5 w-5 text-primary" />
                Edit Note
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Create New Note
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your note title or content."
              : "Add a title and content to store your note securely."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Project Architecture Overview (3-50 characters)"
                      maxLength={50}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your note content here (minimum 10 characters)..."
                      rows={6}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Save Changes" : "Create Note"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
