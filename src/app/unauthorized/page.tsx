"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogoWordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden mesh-dark noise-overlay flex flex-col items-center justify-center px-4 text-white">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />

      <div className="relative z-10 text-center">
        <LogoWordmark light />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-red-300 ring-1 ring-red-500/30">
            <ShieldAlert size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Access Denied
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            You don&apos;t have permission to access this page. Contact your administrator
            if you believe this is an error.
          </p>
          <Link href="/login" className="mt-6 inline-block">
            <Button variant="white">Back to sign in</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
