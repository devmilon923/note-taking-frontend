"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface UserRouteProps {
  children: React.ReactNode;
}

export function UserRoute({ children }: UserRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const search = typeof window !== "undefined" ? window.location.search : "";
        const fullPath = `${pathname}${search}`;
        router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
      } else if (user?.role === "admin") {
        router.replace("/admin");
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Verifying user session...
        </p>
      </div>
    );
  }

  // Prevent flash while redirecting to login or admin console
  if (!isAuthenticated || user?.role === "admin") {
    return null;
  }

  return <>{children}</>;
}
