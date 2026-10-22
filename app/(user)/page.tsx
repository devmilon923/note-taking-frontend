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
  User as UserIcon,
  Shield,
  Tag,
  Mail,
  Calendar,
  Sparkles,
  FileText,
} from "lucide-react";

export default function UserHomePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl w-full mx-auto p-6 md:p-8 space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-3 w-3" /> User Protected Route
            </span>
            {user?.role && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                <Shield className="h-3 w-3" /> {user.role}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-2">
            Welcome, {user?.name || "User"}!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            You are inside the protected user layout. All nested user content is secured at the layout level.
          </p>
        </div>
      </div>

      {/* Profile Details Card */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            Your Profile
          </CardTitle>
          <CardDescription>
            Authenticated session details retrieved via <code className="text-xs font-mono">GET /user/profile</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-card flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Email Address</p>
                <p className="text-sm font-semibold">{user?.email || "—"}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Assigned Role</p>
                <p className="text-sm font-semibold capitalize">{user?.role || "user"}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {user?.interests && user.interests.length > 0 ? (
                    user.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium text-foreground"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">None specified</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">User ID</p>
                <p className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
                  {user?._id || "—"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Context Placeholder */}
      <Card className="border-dashed border-border bg-muted/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            Notes Workspace (Ready for integration)
          </CardTitle>
          <CardDescription>
            User note CRUD operations (<code className="text-xs font-mono">POST /user</code>, <code className="text-xs font-mono">GET /notes</code>, <code className="text-xs font-mono">PATCH /note/:id</code>, <code className="text-xs font-mono">DELETE /note/:id</code>) will live inside this layout.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
