import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { GuestRoute } from "@/components/auth/GuestRoute";
import { BookOpen, Loader2 } from "lucide-react";

export const metadata = {
  title: "Login | Note Taking App",
  description: "Sign in to your Note-Taking account",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <GuestRoute>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
          <div className="mb-6 flex items-center gap-2 text-primary font-bold text-xl">
            <BookOpen className="h-6 w-6" />
            <span>Note-Taking App</span>
          </div>
          <LoginForm />
        </div>
      </GuestRoute>
    </Suspense>
  );
}
