"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { NotesWorkspace } from "@/components/notes/NotesWorkspace";
import { EditProfileDialog } from "@/components/user/EditProfileDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Shield,
  Tag,
  Mail,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit3,
} from "lucide-react";

export function UserHomeView() {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  return (
    <div className="max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-card border border-border/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" /> User Workspace
            </span>
            {user?.role && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-foreground/85 border border-border/80">
                <Shield className="h-3 w-3" /> {user.role}
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold mt-2 tracking-tight text-foreground">
            Welcome back, {user?.name || "User"}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Capture, organize, and manage your personal notes securely.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowProfile((prev) => !prev)}
          className="gap-1.5 text-xs cursor-pointer self-start md:self-auto shrink-0"
        >
          <UserIcon className="h-3.5 w-3.5 text-primary" />
          <span>{showProfile ? "Hide Profile" : "View Profile"}</span>
          {showProfile ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Collapsible Profile Details Card */}
      {showProfile && (
        <Card className="border border-border/80 shadow-xs rounded-xl animate-in fade-in-50 duration-150">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-primary" />
                Account Details
              </CardTitle>
              <CardDescription className="text-xs">
                Synchronized from server
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditProfileOpen(true)}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-xs font-semibold truncate font-mono">
                    {user?.email || "—"}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Role
                  </p>
                  <p className="text-xs font-semibold capitalize">
                    {user?.role || "user"}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors flex items-start gap-2.5">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Interest
                  </p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(() => {
                      const interestsList = Array.isArray(user?.interests)
                        ? user.interests
                        : typeof user?.interests === "string" && user.interests
                          ? [user.interests]
                          : [];
                      return interestsList.length > 0 ? (
                        interestsList.map((interest: string, i: number) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.2 rounded bg-muted text-[10px] font-medium text-foreground capitalize"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    User ID
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground truncate">
                    {user?._id || "—"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Notes Workspace */}
      <section className="space-y-4">
        <NotesWorkspace />
      </section>

      {/* Edit Profile Modal Dialog (PATCH /user/profile) */}
      <EditProfileDialog
        user={user}
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
      />
    </div>
  );
}
