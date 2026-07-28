"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";

export function SignOutButton({
  variant = "ghost",
  compact = false,
}: {
  variant?: "ghost" | "danger";
  compact?: boolean;
}) {
  return (
    <Button
      variant={variant}
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={compact ? "!min-h-0 !px-2 !py-1.5 !text-xs" : ""}
    >
      <LogOut size={compact ? 14 : 16} />
      {!compact && "Sign out"}
    </Button>
  );
}
