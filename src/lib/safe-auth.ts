import { auth } from "@/auth";
import { Session } from "next-auth";

/**
 * Safe auth wrapper — returns null instead of throwing on stale JWT cookies
 * (e.g. from another project using next-auth on a different port).
 */
export async function safeAuth(): Promise<Session | null> {
  try {
    return await auth();
  } catch {
    return null;
  }
}
