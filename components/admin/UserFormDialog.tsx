"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ALLOWED_INTERESTS, User } from "@/types/auth";
import {
  CreateUserInput,
  createUserSchema,
  UpdateUserInput,
  updateUserSchema,
} from "@/types/admin";
import { useCreateUser, useUpdateUser } from "@/hooks/useAdmin";
import { getFieldErrors } from "@/query/axios";
import { Loader2, Plus, ShieldCheck, User as UserIcon } from "lucide-react";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: User | null;
}

export function UserFormDialog({
  open,
  onOpenChange,
  userToEdit,
}: UserFormDialogProps) {
  const isEditing = Boolean(userToEdit);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");

  // Create Form
  const createForm = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      interests: [],
    },
  });

  // Edit Form
  const editForm = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      role: "user",
      interests: [],
    },
  });

  // Populate form on edit
  useEffect(() => {
    if (open) {
      if (userToEdit) {
        const initialInterests = Array.isArray(userToEdit.interests)
          ? userToEdit.interests
          : typeof userToEdit.interests === "string" && userToEdit.interests
          ? [userToEdit.interests]
          : [];
        setSelectedInterests(initialInterests);
        setSelectedRole(userToEdit.role === "admin" ? "admin" : "user");
        editForm.reset({
          name: userToEdit.name,
          role: userToEdit.role === "admin" ? "admin" : "user",
          interests: initialInterests,
        });
      } else {
        setSelectedInterests([]);
        setSelectedRole("user");
        createForm.reset({
          name: "",
          email: "",
          password: "",
          role: "user",
          interests: [],
        });
      }
    }
  }, [open, userToEdit, createForm, editForm]);

  const toggleInterest = (interest: string) => {
    const next = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(next);
    if (isEditing) {
      editForm.setValue("interests", next);
    } else {
      createForm.setValue("interests", next);
    }
  };

  const handleRoleChange = (role: "user" | "admin") => {
    setSelectedRole(role);
    if (isEditing) {
      editForm.setValue("role", role);
    } else {
      createForm.setValue("role", role);
    }
  };

  const isPending = createUser.isPending || updateUser.isPending;

  const onSubmitCreate = (data: CreateUserInput) => {
    createUser.mutate(
      {
        ...data,
        role: selectedRole,
        interests: selectedInterests,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (error) => {
          const fieldErrors = getFieldErrors(error);
          Object.entries(fieldErrors).forEach(([field, msg]) => {
            createForm.setError(field as any, {
              type: "server",
              message: msg,
            });
          });
        },
      },
    );
  };

  const onSubmitEdit = (data: UpdateUserInput) => {
    if (!userToEdit) return;
    updateUser.mutate(
      {
        id: userToEdit._id,
        data: {
          name: data.name,
          role: selectedRole,
          interests: selectedInterests,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (error) => {
          const fieldErrors = getFieldErrors(error);
          Object.entries(fieldErrors).forEach(([field, msg]) => {
            editForm.setError(field as any, {
              type: "server",
              message: msg,
            });
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <UserIcon className="h-5 w-5 text-primary" />
                Edit User Account
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Create New User
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update account settings and role permissions for ${userToEdit?.email}.`
              : "Provision a new account with specified credentials and role permissions."}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <form
            onSubmit={editForm.handleSubmit(onSubmitEdit)}
            className="space-y-4 py-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g. Alex Johnson"
                disabled={isPending}
                {...editForm.register("name")}
              />
              {editForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {editForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input value={userToEdit?.email} disabled className="bg-muted/50" />
              <p className="text-[11px] text-muted-foreground">
                Email address cannot be changed after registration.
              </p>
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <Label>Account Role</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={selectedRole === "user" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRoleChange("user")}
                  disabled={isPending}
                  className="gap-2 cursor-pointer"
                >
                  <UserIcon className="h-4 w-4" />
                  User Role
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "admin" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleRoleChange("admin")}
                  disabled={isPending}
                  className="gap-2 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Role
                </Button>
              </div>
            </div>

            {/* Interests Selector */}
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2">
                {ALLOWED_INTERESTS.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <Badge
                      key={interest}
                      variant={active ? "default" : "outline"}
                      onClick={() => !isPending && toggleInterest(interest)}
                      className="cursor-pointer capitalize select-none py-1 px-3 text-xs"
                    >
                      {active ? `✓ ${interest}` : `+ ${interest}`}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form
            onSubmit={createForm.handleSubmit(onSubmitCreate)}
            className="space-y-4 py-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor="create-name">Full Name</Label>
              <Input
                id="create-name"
                placeholder="e.g. Alex Johnson"
                disabled={isPending}
                {...createForm.register("name")}
              />
              {createForm.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {createForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-email">Email Address</Label>
              <Input
                id="create-email"
                type="email"
                placeholder="name@example.com"
                disabled={isPending}
                {...createForm.register("email")}
              />
              {createForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {createForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="create-password">Initial Password</Label>
              <Input
                id="create-password"
                type="password"
                placeholder="Minimum 6 characters"
                disabled={isPending}
                {...createForm.register("password")}
              />
              {createForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {createForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <Label>Account Role</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={selectedRole === "user" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRoleChange("user")}
                  disabled={isPending}
                  className="gap-2 cursor-pointer"
                >
                  <UserIcon className="h-4 w-4" />
                  User Role
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "admin" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleRoleChange("admin")}
                  disabled={isPending}
                  className="gap-2 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Role
                </Button>
              </div>
            </div>

            {/* Interests Selector */}
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2">
                {ALLOWED_INTERESTS.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <Badge
                      key={interest}
                      variant={active ? "default" : "outline"}
                      onClick={() => !isPending && toggleInterest(interest)}
                      className="cursor-pointer capitalize select-none py-1 px-3 text-xs"
                    >
                      {active ? `✓ ${interest}` : `+ ${interest}`}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
