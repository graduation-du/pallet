"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type ReactNode,
} from "react";

type Variant =
  | "primary"
  | "secondary"
  | "field"
  | "dispatch"
  | "admin"
  | "danger"
  | "ghost"
  | "white";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-md shadow-blue-700/30 hover:from-blue-500 hover:to-blue-800 focus-visible:ring-blue-600",
  secondary:
    "bg-white text-ink border border-line shadow-sm hover:border-line-strong hover:bg-surface focus-visible:ring-blue-600",
  field:
    "bg-gradient-to-b from-orange-500 to-field text-white shadow-md shadow-orange-600/25 hover:brightness-105 focus-visible:ring-field",
  dispatch:
    "bg-gradient-to-b from-violet-500 to-purple-800 text-white shadow-md shadow-violet-700/30 hover:brightness-105 focus-visible:ring-violet-600",
  admin:
    "bg-gradient-to-b from-navy-800 to-admin text-white shadow-md shadow-navy-900/30 focus-visible:ring-admin",
  danger:
    "bg-danger text-white shadow-md shadow-red-600/20 hover:bg-red-700 focus-visible:ring-danger",
  ghost:
    "bg-transparent text-muted hover:bg-black/5 hover:text-ink focus-visible:ring-blue-600",
  white:
    "bg-white text-navy-900 shadow-lg shadow-black/10 hover:bg-sky-100 focus-visible:ring-white",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
  children?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "primary",
    fullWidth,
    className = "",
    children,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={fullWidth ? "w-full" : "inline-flex"}
      whileTap={reduce || disabled ? undefined : { scale: 0.98 }}
      whileHover={reduce || disabled ? undefined : { y: -1 }}
    >
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={[
          "btn-shine inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          fullWidth ? "w-full" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  );
});
