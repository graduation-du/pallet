import { safeAuth } from "@/lib/safe-auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { UsersPageClient } from "@/components/admin/UsersPageClient";

export default async function UsersPage() {
  const session = await safeAuth();
  if (!session?.user) redirect("/login");

  return (
    <AdminShell userName={session.user.name} userRole={session.user.role}>
      <UsersPageClient />
    </AdminShell>
  );
}
