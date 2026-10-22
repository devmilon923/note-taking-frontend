"use client";

import React, { useState } from "react";
import { useUserInterests } from "@/hooks/useAdmin";
import { InterestUser } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Compass,
  Flower2,
  Loader2,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { UserNotesLookupDialog } from "./UserNotesLookupDialog";

export function InterestsAnalyticsTab() {
  const { data, isLoading, isError, refetch, isFetching } = useUserInterests();

  const [lookupUser, setLookupUser] = useState<InterestUser | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  const groups = data?.data || [];

  const handleOpenLookup = (user: InterestUser) => {
    setLookupUser(user);
    setLookupOpen(true);
  };

  const totalMemberships = groups.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">
              Community Interests Aggregation
            </h3>
            <Badge variant="outline" className="text-[10px] font-mono">
              $unwind & $group
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time clustering of users based on registered passions and hobbies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 text-xs gap-1.5 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Cluster Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 bg-card rounded-xl border border-border">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Calculating aggregation pipelines...</p>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-card rounded-xl border border-border space-y-3">
          <p className="text-sm font-medium text-destructive">
            Failed to aggregate interest data.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2 bg-card rounded-xl border border-border">
          <Compass className="h-10 w-10 text-muted-foreground/60" />
          <p className="text-sm font-medium">No interest clusters found</p>
          <p className="text-xs">
            Users have not declared any specific interests yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => {
            return (
              <div
                key={group.interest}
                className="p-5 rounded-xl border border-border/80 bg-card flex flex-col justify-between gap-4 shadow-xs"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/70">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Flower2 className="h-4 w-4" />
                      </div>
                      <h4 className="font-semibold text-base capitalize text-foreground">
                        {group.interest}
                      </h4>
                    </div>

                    <Badge variant="secondary" className="gap-1 font-mono text-xs">
                      <Users className="h-3 w-3" />
                      {group.count} {group.count === 1 ? "user" : "users"}
                    </Badge>
                  </div>

                  {/* Users in this interest */}
                  <div className="pt-3 space-y-2">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Group Members
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {group.users.map((u) => {
                        const initial = u.name
                          ? u.name.charAt(0).toUpperCase()
                          : "U";

                        return (
                          <div
                            key={u._id}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors duration-150 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {u.name}
                                </p>
                                <p className="text-[10px] text-muted-foreground font-mono truncate">
                                  {u.email}
                                </p>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenLookup(u)}
                              className="h-6 px-2 text-[10px] gap-1 text-muted-foreground hover:text-foreground cursor-pointer shrink-0 transition-colors duration-150"
                              title="Inspect notes via $lookup"
                            >
                              <BookOpen className="h-3 w-3 text-primary" />
                              <span>Notes</span>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground font-mono">
                  Aggregation ID: #{group.interest}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Notes Lookup Dialog */}
      <UserNotesLookupDialog
        open={lookupOpen}
        onOpenChange={setLookupOpen}
        userId={lookupUser?._id || null}
        userName={lookupUser?.name}
        userEmail={lookupUser?.email}
      />
    </div>
  );
}
