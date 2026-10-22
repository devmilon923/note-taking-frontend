"use client";

import React, { useMemo, useState } from "react";
import { User } from "@/types/auth";
import { useAdminUsers } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";
import { UserFormDialog } from "./UserFormDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserNotesLookupDialog } from "./UserNotesLookupDialog";

export function UserManagementTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Reset page to 1 when search query or role filter changes
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  const { data, isLoading, isError, refetch } = useAdminUsers({
    page,
    limit,
    role: roleFilter === "all" ? undefined : roleFilter,
    searchQ: debouncedSearch.trim() || undefined,
  });

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [lookupDialogOpen, setLookupDialogOpen] = useState(false);
  const [lookupUser, setLookupUser] = useState<User | null>(null);

  const users = data?.data || [];
  const pagination = data?.pagination;

  const handleOpenCreate = () => {
    setUserToEdit(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setFormDialogOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleOpenLookup = (user: User) => {
    setLookupUser(user);
    setLookupDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3.5 rounded-xl border border-border/80 shadow-xs">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/70 p-1 rounded-lg border border-border/60">
            <Button
              variant={roleFilter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRoleFilter("all")}
              className="h-7 text-xs px-2.5 cursor-pointer transition-all duration-150"
            >
              All
            </Button>
            <Button
              variant={roleFilter === "user" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRoleFilter("user")}
              className="h-7 text-xs px-2.5 cursor-pointer transition-all duration-150"
            >
              Users
            </Button>
            <Button
              variant={roleFilter === "admin" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRoleFilter("admin")}
              className="h-7 text-xs px-2.5 cursor-pointer transition-all duration-150"
            >
              Admins
            </Button>
          </div>
        </div>

        <Button
          onClick={handleOpenCreate}
          size="sm"
          className="gap-1.5 cursor-pointer text-xs shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table / List */}
      <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Loading user directory...</p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center space-y-3">
            <ShieldAlert className="h-8 w-8 text-destructive mx-auto" />
            <p className="text-sm font-medium text-destructive">
              Failed to load user accounts.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Users className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm font-medium">No users found</p>
            <p className="text-xs">
              {searchQuery || roleFilter !== "all"
                ? "Try adjusting your search query or role filter."
                : "No registered accounts exist yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/70 text-muted-foreground uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Interests</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((user) => {
                  const initial = user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U";
                  const isAdmin = user.role === "admin";
                  const interestsList = Array.isArray(user.interests)
                    ? user.interests
                    : typeof user.interests === "string" && user.interests
                    ? [user.interests]
                    : [];

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                              isAdmin
                                ? "bg-muted text-foreground border border-border/80 font-bold"
                                : "bg-primary/10 text-primary font-bold"
                            }`}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {user.name}
                            </p>
                            <p className="text-muted-foreground truncate font-mono text-[11px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isAdmin ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-medium gap-1 bg-muted/80 text-foreground border-border/80"
                          >
                            <ShieldCheck className="h-3 w-3 text-primary" /> Admin
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase font-medium gap-1 text-muted-foreground"
                          >
                            <UserIcon className="h-3 w-3" /> User
                          </Badge>
                        )}
                      </td>

                      {/* Interests */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {interestsList.length > 0 ? (
                            interestsList.map((interest) => (
                              <Badge
                                key={interest}
                                variant="outline"
                                className="text-[10px] capitalize px-2 py-0 h-5"
                              >
                                {interest}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-[11px] italic">
                              None
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-muted-foreground font-mono text-[11px]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenLookup(user)}
                            className="h-7 px-2.5 text-[11px] gap-1 cursor-pointer transition-colors duration-150"
                            title="View notes via $lookup"
                          >
                            <BookOpen className="h-3.5 w-3.5 text-primary" />
                            <span className="hidden md:inline">Notes</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(user)}
                            className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-foreground transition-colors duration-150"
                            title="Edit user"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDelete(user)}
                            className="h-7 w-7 p-0 cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
                            title="Delete user"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination && pagination.totalData > 0 && (
          <div className="p-3.5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/20">
            <div className="flex items-center gap-3">
              <span>
                Showing Page <span className="font-semibold text-foreground">{pagination.currentPage}</span> of{" "}
                <span className="font-semibold text-foreground">{pagination.totalPage}</span> (
                {pagination.totalData} total accounts)
              </span>

              {/* Page Size Selector */}
              <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-border/80">
                <span className="text-[11px]">Per page:</span>
                {[2, 5, 10, 20].map((size) => (
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
      </div>

      {/* Dialogs */}
      <UserFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        userToEdit={userToEdit}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={userToDelete}
      />

      <UserNotesLookupDialog
        open={lookupDialogOpen}
        onOpenChange={setLookupDialogOpen}
        userId={lookupUser?._id || null}
        userName={lookupUser?.name}
        userEmail={lookupUser?.email}
      />
    </div>
  );
}
