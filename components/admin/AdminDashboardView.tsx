"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  useAdminUsers,
  useAdminNotes,
  useUserInterests,
} from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  FileSpreadsheet,
  Lock,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { UserManagementTable } from "./UserManagementTable";
import { GlobalNotesTab } from "./GlobalNotesTab";
import { InterestsAnalyticsTab } from "./InterestsAnalyticsTab";

type AdminTab = "users" | "notes" | "interests";

export function AdminDashboardView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  // Fetch summary counters
  const { data: usersData } = useAdminUsers(1, 1);
  const { data: notesData } = useAdminNotes(1, 1);
  const { data: interestsData } = useUserInterests();

  const totalUsers = usersData?.pagination?.totalData ?? 0;
  const totalNotes = notesData?.pagination?.totalData ?? 0;
  const totalInterestClusters = interestsData?.data?.length ?? 0;

  return (
    <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Banner with Stats */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">
              <Lock className="h-3 w-3" /> Admin Console
            </span>
            <Badge variant="outline" className="text-xs font-normal">
              Full Administrative Privileges
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            System Administration & Oversight
          </h2>
          <p className="text-xs text-muted-foreground">
            Authenticated as <span className="font-semibold text-foreground">{user?.name}</span> (
            <span className="font-mono">{user?.email}</span>)
          </p>
        </div>

        {/* Quick Stats Pill Cards */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-xl bg-muted/50 border border-border/80 flex flex-col items-center justify-center min-w-[90px] text-center">
            <Users className="h-4 w-4 text-primary mb-1" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              {totalUsers}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Users
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/50 border border-border/80 flex flex-col items-center justify-center min-w-[90px] text-center">
            <FileSpreadsheet className="h-4 w-4 text-purple-600 dark:text-purple-400 mb-1" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              {totalNotes}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Notes
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/50 border border-border/80 flex flex-col items-center justify-center min-w-[90px] text-center">
            <Compass className="h-4 w-4 text-amber-600 dark:text-amber-400 mb-1" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              {totalInterestClusters}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Clusters
            </span>
          </div>
        </div>
      </div>

      {/* Clean Navigation Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("users")}
          className="gap-2 text-xs cursor-pointer font-medium"
        >
          <Users className="h-4 w-4" />
          <span>User Directory</span>
          <Badge
            variant={activeTab === "users" ? "secondary" : "outline"}
            className="text-[10px] h-4 px-1.5 ml-0.5"
          >
            {totalUsers}
          </Badge>
        </Button>

        <Button
          variant={activeTab === "notes" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("notes")}
          className="gap-2 text-xs cursor-pointer font-medium"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Global Notes</span>
          <Badge
            variant={activeTab === "notes" ? "secondary" : "outline"}
            className="text-[10px] h-4 px-1.5 ml-0.5"
          >
            {totalNotes}
          </Badge>
        </Button>

        <Button
          variant={activeTab === "interests" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("interests")}
          className="gap-2 text-xs cursor-pointer font-medium"
        >
          <Compass className="h-4 w-4" />
          <span>Interest Analytics</span>
          <Badge
            variant={activeTab === "interests" ? "secondary" : "outline"}
            className="text-[10px] h-4 px-1.5 ml-0.5"
          >
            {totalInterestClusters}
          </Badge>
        </Button>
      </div>

      {/* Active Tab Panel */}
      <div className="pt-1">
        {activeTab === "users" && <UserManagementTable />}
        {activeTab === "notes" && <GlobalNotesTab />}
        {activeTab === "interests" && <InterestsAnalyticsTab />}
      </div>
    </div>
  );
}
