import { homePathForRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import { LandingClient } from "@/components/marketing/LandingClient";
import { safeAuth } from "@/lib/safe-auth";

export default async function HomePage() {
  const session = await safeAuth();
  if (session?.user?.role) {
    redirect(homePathForRole(session.user.role));
  }

  return <LandingClient />;
}
