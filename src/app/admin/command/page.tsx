import { safeAuth } from "@/lib/safe-auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { CommandCenterClient } from "@/components/admin/CommandCenterClient";

export default async function CommandCenterPage() {
  const session = await safeAuth();
  if (!session?.user) redirect("/login");

  const allowed = ["administrator", "manager"];
  if (!allowed.includes(session.user.role)) redirect("/admin");

  return (
    <AdminShell userName={session.user.name} userRole={session.user.role}>
      <CommandCenterClient />
    </AdminShell>
  );
}
