"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  interactive = false,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={
        interactive && !reduce ? { y: -2, transition: { duration: 0.2 } } : undefined
      }
      className={[
        "premium-card p-5",
        glow ? "ring-1 ring-sky-400/25" : "",
        className,
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "blue",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "blue" | "teal" | "field" | "warn" | "danger" | "ok";
}) {
  const bar = {
    blue: "from-blue-800 to-sky-400",
    teal: "from-blue-800 to-sky-400",
    field: "from-orange-500 to-amber-300",
    warn: "from-amber-600 to-yellow-300",
    danger: "from-red-600 to-rose-300",
    ok: "from-emerald-600 to-teal-400",
  }[accent];

  return (
    <div className="stat-tile p-4">
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${bar}`} />
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
