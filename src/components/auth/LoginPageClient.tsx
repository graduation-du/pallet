"use client";

import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/LoginForm";
import { LogoWordmark } from "@/components/brand/Logo";

export function LoginPageClient() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden mesh-dark noise-overlay">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl items-center lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left — branding panel (hidden on mobile) */}
        <section className="relative hidden flex-col justify-between px-8 py-6 text-white lg:flex xl:px-12 xl:py-8">
          <div className="flex items-center justify-between">
            <LogoWordmark light />
            <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200">
              Enterprise visibility
            </div>
          </div>

          <div className="my-4 w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/55 p-6 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                Pallet lifecycle control
              </div>
              <h1 className="mt-4 font-display text-[1.9rem] font-semibold leading-tight tracking-tight text-white xl:text-[2.35rem]">
                Track every pallet from receipt to return.
              </h1>
              <p className="mt-3 max-w-lg text-[14px] leading-7 text-slate-300">
                Give your team a clear, auditable path for every pallet movement across loading, dispatch, delivery, and reverse logistics.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  <span>Live scan preview</span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300">
                    Scanning
                  </span>
                </div>

                <div className="mt-3 rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <div className="relative overflow-hidden rounded-xl border border-sky-300/20 bg-slate-900/80 p-3">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_45%)]" />
                    <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-3">
                      <div className="absolute inset-2 rounded-xl border border-dashed border-sky-300/40" />
                      <div className="grid grid-cols-3 gap-1.5">
                        {Array.from({ length: 9 }).map((_, index) => (
                          <div
                            key={index}
                            className={`h-3 w-3 rounded-sm ${index % 2 === 0 ? "bg-white/80" : "bg-sky-400/80"}`}
                          />
                        ))}
                      </div>
                      <motion.div
                        className="absolute inset-x-4 h-[2px] rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.8)]"
                        animate={{ y: [0, 92, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      <span>QR / Barcode</span>
                      <span className="text-sky-300">Pallet 1042</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-400">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">ISO-ready audit trail</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Role-based security</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Mobile-first scanner</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span>Operational confidence for dispatch, warehousing, and returns</span>
          </div>
        </section>

        {/* Right — login form */}
        <section className="relative flex flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-4 w-full max-w-[420px] lg:hidden">
            <div className="rounded-[24px] border border-white/10 bg-slate-900/55 p-5 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <LogoWordmark light />
                <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-200">
                  Live
                </span>
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold tracking-tight text-white">
                Pallet tracking built for modern operations
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                QR-driven visibility across loading, dispatch, delivery, and returns.
              </p>
            </div>
          </div>

          <div className="w-full max-w-[420px] rounded-[24px] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/35 backdrop-blur-xl sm:p-7">
            <div className="mb-4 text-center lg:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-200/90">
                Workspace access
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.8rem]">
                Sign in to your workspace
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Warehouse loaders, dispatchers, and factory admins each enter a tailored portal.
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </div>
    </div>
  );
}
