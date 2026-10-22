"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { NotesWorkspace } from "@/components/notes/NotesWorkspace";
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
} from "lucide-react";

export function UserHomeView() {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-3 w-3" /> User Workspace
            </span>
            {user?.role && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                <Shield className="h-3 w-3" /> {user.role}
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 tracking-tight">
            Welcome back, {user?.name || "User"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
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
        <Card className="border-border shadow-sm animate-in fade-in-50 duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-primary" />
              Account Details
            </CardTitle>
            <CardDescription className="text-xs">
              Synchronized from <code className="font-mono">GET /user/profile</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border bg-card/60 flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">Email</p>
                  <p className="text-xs font-semibold truncate">{user?.email || "—"}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-card/60 flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground">Role</p>
                  <p className="text-xs font-semibold capitalize">{user?.role || "user"}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-card/60 flex items-start gap-2.5">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">Interests</p>
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
                            className="px-1.5 py-0.2 rounded bg-muted text-[10px] font-medium text-foreground"
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

              <div className="p-3 rounded-xl border bg-card/60 flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground">User ID</p>
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
    </div>
  );
}
