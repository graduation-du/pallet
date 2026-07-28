import { NextRequest, NextResponse } from "next/server";
import { safeAuth } from "@/lib/safe-auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { buildPalletTransitionNotification } from "@/lib/notifications";
import { getTransitionsFrom } from "@/lib/pallet-machine";

export async function POST(req: NextRequest) {
  const session = await safeAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { palletId, action, payload, note } = body;

  if (!palletId || !action) {
    return NextResponse.json({ error: "Missing palletId or action" }, { status: 400 });
  }

  const pallet = await prisma.pallet.findUnique({ where: { id: palletId } });
  if (!pallet) return NextResponse.json({ error: "Pallet not found" }, { status: 404 });

  // Allow any valid transition matching the submitted action AND the caller's role
  const allTransitions = getTransitionsFrom(pallet.status);
  const transition = allTransitions.find(
    (t) => t.action === action && t.roles.includes(session.user.role)
  );
  if (!transition) {
    return NextResponse.json({ error: "Invalid transition for your role and pallet status" }, { status: 400 });
  }

  const data: {
    status: typeof transition.to;
    tripCount?: number;
    currentUserId?: string;
    returnDueDate?: Date;
    currentLocation?: string;
  } = {
    status: transition.to,
    currentUserId: session.user.id,
  };

  // Trip count increments when returning to available
  if (transition.to === "available") {
    data.tripCount = pallet.tripCount + 1;
  }

  // Calculate return due date on delivery
  if (transition.to === "delivered") {
    const returnDays = await prisma.setting.findUnique({ where: { key: "return_window_days" } });
    const days = Number(returnDays?.value || 14);
    const due = new Date();
    due.setDate(due.getDate() + days);
    data.returnDueDate = due;
  }

  // Extract location from payload
  if (payload?.destination) data.currentLocation = payload.destination;
  if (payload?.truckNumber) data.currentLocation = `Truck: ${payload.truckNumber}`;

  const [updatedPallet] = await prisma.$transaction([
    prisma.pallet.update({ where: { id: palletId }, data }),
    prisma.movement.create({
      data: {
        palletId,
        userId: session.user.id,
        action,
        fromStatus: pallet.status,
        toStatus: transition.to,
        payload: payload || undefined,
        note: note || null,
      },
    }),
  ]);

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action,
    entity: "Pallet",
    entityId: palletId,
    detail: `${pallet.palletNumber}: ${pallet.status} → ${transition.to}`,
  });

  // ── Auto-notifications for pallet transitions ──────────────
  const notifData = buildPalletTransitionNotification({
    palletNumber: pallet.palletNumber,
    actorName: session.user.name || session.user.email,
    transitionTo: transition.to,
    palletId,
  });

  const recipients = await prisma.user.findMany({
    where: { role: { in: ["administrator", "manager"] }, active: true },
    select: { id: true },
  });

  if (recipients.length > 0) {
    await prisma.notification.createMany({
      data: recipients.map((r) => ({
        userId: r.id,
        type: notifData.type,
        title: notifData.title,
        message: notifData.message,
        link: notifData.link,
      })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json({ pallet: updatedPallet });
}
