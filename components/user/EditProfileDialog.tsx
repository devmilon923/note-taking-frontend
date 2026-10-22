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
import { getErrorMessage, getFieldErrors } from "@/query/axios";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const editProfileSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  interests: z.array(z.string()).optional(),
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
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || "",
      interests: [],
    },
  });

  // Synchronize form when user or dialog open state changes
  useEffect(() => {
    if (open && user) {
      const userInterests = Array.isArray(user.interests)
        ? user.interests
        : typeof user.interests === "string" && user.interests
          ? [user.interests]
          : [];

      setSelectedInterests(userInterests);
      form.reset({
        name: user.name || "",
        interests: userInterests,
      });
    }
  }, [open, user, form]);

  const toggleInterest = (interest: string) => {
    const next = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(next);
    form.setValue("interests", next);
  };

  const onSubmit = async (values: EditProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await authService.updateProfile({
        name: values.name,
        interests: selectedInterests,
      });

      queryClient.setQueryData(AUTH_QUERY_KEY, response);
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      toast.success(response.message || "Profile updated successfully!");
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
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <UserCheck className="h-4 w-4 text-primary" />
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-xs">
            Update your account name and personalize your topic interests.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Full Name</FormLabel>
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

            {/* Read-only email indicator */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-foreground">Email Address</span>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted/40 font-mono text-xs cursor-not-allowed opacity-80"
              />
              <p className="text-[11px] text-muted-foreground">
                Email address is permanently linked to your account.
              </p>
            </div>

            {/* Interests Selector */}
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-medium">Interests</FormLabel>
                    {selectedInterests.length > 0 && (
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {selectedInterests.length} selected
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {ALLOWED_INTERESTS.map((interest) => {
                        const active = selectedInterests.includes(interest);
                        return (
                          <Badge
                            key={interest}
                            variant={active ? "default" : "outline"}
                            onClick={() => !isSubmitting && toggleInterest(interest)}
                            className="cursor-pointer capitalize select-none py-1.5 px-3 text-xs transition-all duration-150 active:scale-[0.98]"
                          >
                            {active ? `✓ ${interest}` : `+ ${interest}`}
                          </Badge>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormDescription className="text-[11px] text-muted-foreground">
                    Select topics you are interested in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="cursor-pointer gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving...
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
