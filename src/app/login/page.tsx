import { Suspense } from "react";
import { LoginPageClient } from "@/components/auth/LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-navy-950 text-white">
          <p className="text-sm text-slate-400">Loading…</p>
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
