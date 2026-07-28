import { NextRequest, NextResponse } from "next/server";
import { safeAuth } from "@/lib/safe-auth";
import { prisma } from "@/lib/db";
import { hashSync } from "bcryptjs";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const session = await safeAuth();
  if (!session?.user || session.user.role !== "administrator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      createdAt: true,
      _count: { select: { movements: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const session = await safeAuth();
  if (!session?.user || session.user.role !== "administrator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { email, name, role, password } = body;

  if (!email || !name || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      role,
      passwordHash: hashSync(password || "password123", 10),
    },
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "create_user",
    entity: "User",
    entityId: user.id,
    detail: `Created user ${name} (${role})`,
  });

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}

export async function PATCH(req: NextRequest) {
  const session = await safeAuth();
  if (!session?.user || session.user.role !== "administrator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { id, name, role, active, password } = body;

  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  // Prevent admin from deactivating their own account
  if (id === session.user.id && active === false) {
    return NextResponse.json({ error: "Cannot deactivate your own account" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = String(name).trim();
  if (role !== undefined) updateData.role = role;
  if (active !== undefined) updateData.active = Boolean(active);
  if (password) updateData.passwordHash = (await import("bcryptjs")).hashSync(password, 10);

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, email: true, name: true, role: true, active: true },
  });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "update_user",
    entity: "User",
    entityId: id,
    detail: `Updated user ${updated.name}: ${Object.keys(updateData).join(", ")}`,
  });

  return NextResponse.json({ user: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await safeAuth();
  if (!session?.user || session.user.role !== "administrator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { name: true, email: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Soft-delete: deactivate rather than hard delete to preserve audit trail
  await prisma.user.update({ where: { id }, data: { active: false } });

  await logAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "deactivate_user",
    entity: "User",
    entityId: id,
    detail: `Deactivated user ${user.name} (${user.email})`,
  });

  return NextResponse.json({ ok: true });
}
