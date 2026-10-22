"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Users,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">
      {/* Admin Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-destructive/15 via-destructive/5 to-transparent border border-destructive/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground">
              <Lock className="h-3 w-3" /> Admin Protected Route
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-2">
            Admin Management Console
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Logged in as <span className="font-semibold text-foreground">{user?.name}</span> ({user?.email}) with administrative rights.
          </p>
        </div>
      </div>

      {/* Admin Sections Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-border">
          <CardHeader>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit mb-2">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">User Management</CardTitle>
            <CardDescription>
              Paginated list of all registered users with creation and role details.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Endpoint: <code className="font-mono">GET /users?page=1&limit=10</code>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-2">
              <Compass className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">User Interests Analytics</CardTitle>
            <CardDescription>
              MongoDB aggregation grouping users by interest with aggregated counts.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Endpoint: <code className="font-mono">GET /user/interests</code>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit mb-2">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">Global Notes Oversight</CardTitle>
            <CardDescription>
              Search and inspect notes across all users via MongoDB $lookup pipelines.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Endpoint: <code className="font-mono">GET /notes</code> & <code className="font-mono">GET /user/notes/:id</code>
          </CardContent>
        </Card>
      </div>

      {/* Security Status */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Route Security Status
          </CardTitle>
          <CardDescription>
            Admin layout-level protection is fully active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Regular users attempting to enter <code className="text-xs font-mono">/admin</code> are automatically redirected to <code className="text-xs font-mono">/</code>.</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Unauthenticated visitors are redirected to <code className="text-xs font-mono">/login?redirect=/admin</code>.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
