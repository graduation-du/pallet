"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogoWordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { QrCode, Route, ShieldCheck, Package, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: QrCode,
    title: "QR asset identity",
    body: "Every pallet carries a unique digital ID from production through delivery and return — permanently.",
  },
  {
    icon: Route,
    title: "State-driven scanning",
    body: "Scan a pallet and the system automatically presents the correct next-action form for your role.",
  },
  {
    icon: ShieldCheck,
    title: "Lifecycle governance",
    body: "Full audit trail of every movement, damage record, repair cycle, and retirement decision.",
  },
];

const stats = [
  { value: "8", label: "Role portals" },
  { value: "QR", label: "Pallet truth layer" },
  { value: "12", label: "Operational reports" },
];

export function LandingClient() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden mesh-dark noise-overlay text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(100vw,520px)] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5 sm:px-6 sm:py-6">
        <LogoWordmark light />
        <Link href="/login" className="shrink-0">
          <Button variant="white" className="!min-h-11 !px-4 sm:!px-5">
            Staff sign in
          </Button>
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 pt-2 sm:px-6 sm:gap-10 sm:pb-20 sm:pt-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:pt-8">
        {/* Left — copy */}
        <div className="space-y-5 sm:space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300 sm:text-[11px]"
          >
            <Package size={14} /> Returnable pallet tracking platform
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-[1.85rem] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl xl:text-[3.25rem]"
          >
            Track Every Pallet. Every Movement. Every Return.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg"
          >
            PalletTrack Pro unifies manufacturing, warehouse loading, dispatch, delivery,
            and return tracking in one secure web app — built for factories that cannot
            afford lost pallets or disrupted production schedules.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="primary"
                fullWidth
                className="!min-h-[52px] sm:!w-auto sm:!px-7 text-[15px]"
              >
                Enter secure portal
                <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-5 pt-2 text-sm text-slate-400 sm:gap-6 sm:pt-4"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-xl font-bold text-white sm:text-2xl">{s.value}</p>
                <p className="text-xs sm:text-sm">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — visual */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          {/* Pallet lifecycle diagram */}
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-sky-300">
              Pallet lifecycle
            </p>
            <div className="space-y-2">
              {[
                { status: "Available", color: "bg-emerald-500", icon: "📦" },
                { status: "Loaded", color: "bg-blue-500", icon: "📋" },
                { status: "In Transit", color: "bg-violet-500", icon: "🚚" },
                { status: "Delivered", color: "bg-sky-500", icon: "📍" },
                { status: "Returning", color: "bg-amber-500", icon: "🔄" },
                { status: "Available", color: "bg-emerald-500", icon: "📦" },
              ].map((step, i) => (
                <motion.div
                  key={`${step.status}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className={`h-8 w-8 shrink-0 rounded-full ${step.color} flex items-center justify-center text-sm`}>
                    {step.icon}
                  </div>
                  <span className="text-sm font-semibold text-white">{step.status}</span>
                  {i < 5 && <ArrowRight size={14} className="ml-auto text-slate-500" />}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">State-driven scanning</p>
              <p className="mt-1 text-xs text-slate-300">
                Scan a QR code → system checks current status → presents the correct form for your role
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      <section
        id="capabilities"
        className="relative z-10 border-t border-white/10 bg-black/25 py-10 backdrop-blur-sm sm:py-14"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:gap-5 sm:px-6 md:grid-cols-3">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur sm:p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-sky-300 ring-1 ring-sky-400/25">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-base font-bold text-white sm:text-lg">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.body}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-5 text-center text-xs text-slate-500 sm:px-6 sm:py-6">
        PalletTrack Pro · Built for manufacturing &amp; distribution teams
      </footer>
    </div>
  );
}
