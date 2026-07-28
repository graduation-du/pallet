import { NextRequest, NextResponse } from "next/server";
import { safeAuth } from "@/lib/safe-auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { canScan, getNextTransition, getTransitionsFrom } from "@/lib/pallet-machine";

export async function GET(req: NextRequest) {
  const session = await safeAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });

  const pallet = await prisma.pallet.findFirst({
    where: {
      OR: [
        { qrCode: code },
        { palletNumber: code },
      ],
    },
    include: {
      currentUser: { select: { id: true, name: true, email: true } },
      movements: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      },
      damageRecords: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!pallet) {
    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "scan_not_found",
      entity: "Pallet",
      detail: `Scan attempt for code: ${code}`,
    });
    return NextResponse.json({ error: "Pallet not found" }, { status: 404 });
  }

  const allowed = canScan(pallet.status, session.user.role);
  if (!allowed) {
    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "scan_permission_denied",
      entity: "Pallet",
      entityId: pallet.id,
      detail: `Role ${session.user.role} cannot act on status ${pallet.status}`,
    });
    return NextResponse.json({ pallet, permitted: false });
  }

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "scan_lookup",
    entity: "Pallet",
    entityId: pallet.id,
    detail: `Scanned ${pallet.palletNumber} (status: ${pallet.status})`,
  });

  // Return all valid transitions for the role so the client can build forms
  const allTransitions = getTransitionsFrom(pallet.status);
  const roleTransitions = allTransitions
    .filter((t) => t.roles.includes(session.user.role))
    .map((t) => ({ action: t.action, formLabel: t.formLabel, to: t.to }));

  const primaryTransition = getNextTransition(pallet.status, session.user.role);

  return NextResponse.json({
    pallet,
    permitted: true,
    transition: primaryTransition
      ? { action: primaryTransition.action, formLabel: primaryTransition.formLabel, to: primaryTransition.to }
      : null,
    roleTransitions,
  });
}
