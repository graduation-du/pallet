import { NextRequest, NextResponse } from "next/server";
import { safeAuth } from "@/lib/safe-auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await safeAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { palletIds } = body;

  if (!Array.isArray(palletIds) || palletIds.length === 0 || palletIds.length > 500) {
    return NextResponse.json({ error: "Invalid palletIds (1-500)" }, { status: 400 });
  }

  const now = new Date();
  const result = await prisma.pallet.updateMany({
    where: {
      id: { in: palletIds },
      printedAt: null,
    },
    data: { printedAt: now },
  });

  return NextResponse.json({ ok: true, marked: result.count, printedAt: now.toISOString() });
}
