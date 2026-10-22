"use client";

import React from "react";
import Link from "next/link";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Shield,
  LogOut,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

function AdminHeader() {
  const { user, logout, refetchProfile, isLoading } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight">Admin Console</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground">
              Admin Role
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">System Administration & Oversight</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs cursor-pointer">
            <ArrowLeft className="h-3.5 w-3.5" />
            User Workspace
          </Button>
        </Link>

        <div className="hidden sm:flex flex-col text-right">
          <span className="text-xs font-semibold">{user?.name}</span>
          <span className="text-[11px] text-muted-foreground">{user?.email}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetchProfile()}
          className="cursor-pointer gap-1.5"
          disabled={isLoading}
          title="Refresh Profile"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => logout()}
          className="cursor-pointer gap-1.5"
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
