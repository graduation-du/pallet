"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <ToastProvider>
        {children}
        <PwaInstallPrompt />
      </ToastProvider>
    </NextAuthSessionProvider>
  );
}
