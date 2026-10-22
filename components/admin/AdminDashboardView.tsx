"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  FileSpreadsheet,
  Lock,
  Users,
} from "lucide-react";
import { UserManagementTable } from "./UserManagementTable";
import { GlobalNotesTab } from "./GlobalNotesTab";
import { InterestsAnalyticsTab } from "./InterestsAnalyticsTab";

type AdminTab = "users" | "notes" | "interests";

export function AdminDashboardView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  return (
    <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Banner Header */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
        </Button>

        <Button
          variant={activeTab === "notes" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("notes")}
          className="gap-2 text-xs cursor-pointer font-medium"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Global Notes</span>
        </Button>

        <Button
          variant={activeTab === "interests" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("interests")}
          className="gap-2 text-xs cursor-pointer font-medium"
        >
          <Compass className="h-4 w-4" />
          <span>Interest Analytics</span>
        </Button>
      </div>

      {/* Active Tab Panel (Only loads data when selected) */}
      <div className="pt-1">
        {activeTab === "users" && <UserManagementTable />}
        {activeTab === "notes" && <GlobalNotesTab />}
        {activeTab === "interests" && <InterestsAnalyticsTab />}
      </div>
    </div>
  );
}
