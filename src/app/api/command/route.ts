import { NextResponse } from "next/server";
import { safeAuth } from "@/lib/safe-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await safeAuth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    byStatus,
    total,
    overdueCount,
    recentActivity,
    dailyMovements,
    alertDamaged,
    alertLost,
    alertOverdue,
    throughput7d,
  ] = await Promise.all([
    // Count by every status
    prisma.pallet.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.pallet.count(),

    // Overdue: delivered pallets past return due date
    prisma.pallet.count({
      where: { status: "delivered", returnDueDate: { lt: now } },
    }),

    // Recent activity feed (last 20 movements)
    prisma.movement.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        pallet: { select: { palletNumber: true } },
        user: { select: { name: true, role: true } },
      },
    }),

    // Movements in last 24h grouped by hour (for sparkline)
    prisma.movement.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: since24h } },
      _count: { _all: true },
      orderBy: { createdAt: "asc" },
    }),

    // Alerts: damaged pallets
    prisma.pallet.findMany({
      where: { status: { in: ["damaged", "under_repair"] } },
      select: { id: true, palletNumber: true, status: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),

    // Alerts: lost pallets
    prisma.pallet.findMany({
      where: { status: "lost" },
      select: { id: true, palletNumber: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),

    // Overdue pallets list
    prisma.pallet.findMany({
      where: { status: "delivered", returnDueDate: { lt: now } },
      select: { id: true, palletNumber: true, returnDueDate: true, currentLocation: true },
      orderBy: { returnDueDate: "asc" },
      take: 10,
    }),

    // Trip completions in last 7 days (receive_factory actions)
    prisma.movement.count({
      where: { action: "receive_factory", createdAt: { gte: since7d } },
    }),
  ]);

  // Build status map
  const statusMap: Record<string, number> = {
    available: 0,
    loaded: 0,
    in_transit: 0,
    delivered: 0,
    returning: 0,
    damaged: 0,
    under_repair: 0,
    retired: 0,
    lost: 0,
  };
  for (const row of byStatus) statusMap[row.status] = row._count._all;

  // Build hourly buckets for 24h sparkline (24 buckets)
  const hourBuckets = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(since24h.getTime() + i * 60 * 60 * 1000);
    const next = new Date(hour.getTime() + 60 * 60 * 1000);
    const count = dailyMovements.filter(
      (m) => m.createdAt >= hour && m.createdAt < next
    ).reduce((a, b) => a + b._count._all, 0);
    return { hour: hour.getHours(), count };
  });

  return NextResponse.json({
    statusMap,
    total,
    overdueCount,
    throughput7d,
    recentActivity: recentActivity.map((m) => ({
      id: m.id,
      action: m.action,
      palletNumber: m.pallet.palletNumber,
      userName: m.user?.name || "System",
      userRole: m.user?.role || "",
      fromStatus: m.fromStatus,
      toStatus: m.toStatus,
      createdAt: m.createdAt.toISOString(),
    })),
    hourBuckets,
    alerts: {
      damaged: alertDamaged.map((p) => ({
        id: p.id,
        palletNumber: p.palletNumber,
        status: p.status,
        updatedAt: p.updatedAt.toISOString(),
      })),
      lost: alertLost.map((p) => ({
        id: p.id,
        palletNumber: p.palletNumber,
        updatedAt: p.updatedAt.toISOString(),
      })),
      overdue: alertOverdue.map((p) => ({
        id: p.id,
        palletNumber: p.palletNumber,
        returnDueDate: p.returnDueDate?.toISOString() || null,
        currentLocation: p.currentLocation,
      })),
    },
  });
}
