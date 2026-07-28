import { safeAuth } from "@/lib/safe-auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { FleetPageClient } from "@/components/admin/FleetPageClient";

export default async function FleetPage() {
  const session = await safeAuth();
  if (!session?.user) redirect("/login");

  const allowed = ["administrator", "manager", "dispatcher"];
  if (!allowed.includes(session.user.role)) redirect("/admin");

  return (
    <AdminShell userName={session.user.name} userRole={session.user.role}>
      <FleetPageClient userRole={session.user.role} />
    </AdminShell>
  );
}
