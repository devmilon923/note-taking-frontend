"use client";

import React from "react";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Shield,
  LogOut,
  RefreshCw,
} from "lucide-react";

function AdminHeader() {
  const { user, logout, refetchProfile, isLoading } = useAuth();

  return (
    <header className="border-b border-border/80 bg-background/95 backdrop-blur-sm sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-foreground">Admin Console</h1>
            <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-foreground/85 border border-border/80">
              Admin Role
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">System Administration & Oversight</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-medium text-foreground">{user?.name}</span>
          <span className="text-[11px] text-muted-foreground font-mono">{user?.email}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetchProfile()}
          className="cursor-pointer gap-1.5 text-muted-foreground hover:text-foreground"
          disabled={isLoading}
          title="Refresh Profile"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className="cursor-pointer gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      <div className="min-h-screen flex flex-col bg-muted/15">
        <AdminHeader />
        <main className="flex-1">{children}</main>
      </div>
    </AdminRoute>
  );
}
