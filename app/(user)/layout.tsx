"use client";

import React from "react";
import Link from "next/link";
import { UserRoute } from "@/components/auth/UserRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  LogOut,
  RefreshCw,
  Shield,
} from "lucide-react";

function UserHeader() {
  const { user, logout, refetchProfile, isLoading } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Note-Taking</h1>
            <p className="text-[11px] text-muted-foreground">User Workspace</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === "admin" && (
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs cursor-pointer">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Admin Portal
            </Button>
          </Link>
        )}

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

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <UserHeader />
        <main className="flex-1">{children}</main>
      </div>
    </UserRoute>
  );
}
