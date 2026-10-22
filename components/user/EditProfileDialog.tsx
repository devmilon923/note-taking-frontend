"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UserCheck } from "lucide-react";

import { ALLOWED_INTERESTS, User } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { AUTH_QUERY_KEY } from "@/context/AuthContext";
import { zodResolver } from "@/lib/zod-resolver";
import { getErrorMessage } from "@/query/axios";

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
import { Button } from "@/components/ui/button";

const editProfileSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  interests: z.enum(["chess", "coding", "swimming", "reading"] as const, {
    message: "Please select one of the allowed interests",
  }),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentInterest = Array.isArray(user?.interests)
    ? (user?.interests[0] as any)
    : user?.interests || "coding";

  const defaultInterest = ALLOWED_INTERESTS.includes(currentInterest)
    ? currentInterest
    : "coding";

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || "",
      interests: defaultInterest,
    },
  });

  useEffect(() => {
    if (open && user) {
      const activeInterest = Array.isArray(user?.interests)
        ? (user.interests[0] as any)
        : user.interests || "coding";

      form.reset({
        name: user.name || "",
        interests: ALLOWED_INTERESTS.includes(activeInterest)
          ? activeInterest
          : "coding",
      });
    }
  }, [open, user, form]);

  const onSubmit = async (values: EditProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await authService.updateProfile({
        name: values.name,
        interests: values.interests,
      });

      queryClient.setQueryData(AUTH_QUERY_KEY, response);
      toast.success(response.message || "Profile updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="h-5 w-5 text-primary" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Update your public profile name and primary interest.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. John Doe (min 3 chars)"
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
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest</FormLabel>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {ALLOWED_INTERESTS.map((interest) => {
                      const isSelected = field.value === interest;
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => field.onChange(interest)}
                          disabled={isSubmitting}
                          className={`flex items-center justify-center py-2 px-3 rounded-2xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
