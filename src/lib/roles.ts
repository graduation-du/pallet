import type { Role } from "@prisma/client";

export type AppRole = Role;

export const ADMIN_ROLES: Role[] = ["administrator", "manager"];

export const SCANNER_ROLES: Role[] = [
  "warehouse_loader",
  "dispatcher",
  "delivery_receiver",
  "return_collector",
  "factory_receiver",
];

/**
 * Where to send each role after login.
 * Non-admin users go to the scan page inside the admin shell.
 */
export function homePathForRole(role: Role): string {
  if (role === "administrator" || role === "manager") return "/admin";
  if (role === "manufacturing") return "/admin/pallets/register";
  // All field roles go to scan page
  return "/admin/scan";
}

/**
 * Route access control — which roles can access which paths.
 */
export function canAccessPath(role: Role, pathname: string): boolean {
  // Admin-only sections
  if (pathname.startsWith("/admin/users")) return ADMIN_ROLES.includes(role);
  if (pathname.startsWith("/admin/settings")) return ADMIN_ROLES.includes(role);
  if (pathname.startsWith("/admin/audit")) return ADMIN_ROLES.includes(role);
  if (pathname.startsWith("/admin/notifications")) return ADMIN_ROLES.includes(role);

  // Manager read-only sections
  if (pathname.startsWith("/admin/reports")) return ADMIN_ROLES.includes(role);
  if (pathname.startsWith("/admin/command")) return ADMIN_ROLES.includes(role);

  if (pathname.startsWith("/admin/dispatch")) {
    return ["administrator", "dispatcher", "manager"].includes(role);
  }
  if (pathname.startsWith("/admin/fleet")) {
    return ["administrator", "dispatcher", "manager"].includes(role);
  }

  // Register pallet + label printing — manufacturing + admin only
  if (pathname.startsWith("/admin/pallets/register")) {
    return ["administrator", "manufacturing"].includes(role);
  }
  if (pathname.startsWith("/admin/pallets/labels")) {
    return ["administrator", "manufacturing"].includes(role);
  }

  // Scan + pallets accessible to all authenticated users
  if (pathname.startsWith("/admin/scan")) return true;
  if (pathname.startsWith("/admin/pallets")) return true;
  if (pathname === "/admin") return true;

  return true;
}

export function roleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    administrator: "Administrator",
    manufacturing: "Manufacturing Staff",
    warehouse_loader: "Warehouse Loader",
    dispatcher: "Dispatcher",
    delivery_receiver: "Delivery Receiver",
    return_collector: "Return Collector",
    factory_receiver: "Factory Receiver",
    manager: "Manager",
  };
  return labels[role] || role;
}

export function roleBadgeColor(role: Role): string {
  const colors: Record<Role, string> = {
    administrator: "neutral",
    manufacturing: "blue",
    warehouse_loader: "field",
    dispatcher: "dispatch",
    delivery_receiver: "ok",
    return_collector: "warn",
    factory_receiver: "teal",
    manager: "neutral",
  };
  return colors[role] || "neutral";
}
