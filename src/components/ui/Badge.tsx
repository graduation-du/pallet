import type { ReactNode } from "react";

const styles = {
  teal: "bg-blue-50 text-blue-800 ring-blue-600/15",
  blue: "bg-blue-50 text-blue-800 ring-blue-600/15",
  field: "bg-orange-50 text-orange-800 ring-orange-600/15",
  dispatch: "bg-violet-50 text-violet-800 ring-violet-600/15",
  ok: "bg-emerald-50 text-emerald-800 ring-emerald-600/15",
  warn: "bg-amber-50 text-amber-900 ring-amber-600/15",
  danger: "bg-red-50 text-red-800 ring-red-600/15",
  neutral: "bg-slate-100 text-slate-700 ring-slate-500/10",
  dark: "bg-white/10 text-white ring-white/15",
};

export function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: keyof typeof styles;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ring-1 ring-inset ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
