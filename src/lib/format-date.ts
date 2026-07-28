/** Locale-stable formatting — avoids SSR/client hydration mismatches */

function d(input: string | Date) {
  return typeof input === "string" ? new Date(input) : input;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** e.g. 19 Jul 2026 */
export function formatDate(input: string | Date): string {
  const x = d(input);
  if (Number.isNaN(x.getTime())) return "—";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${pad(x.getUTCDate())} ${months[x.getUTCMonth()]} ${x.getUTCFullYear()}`;
}

/** e.g. 19 Jul 2026, 14:30 */
export function formatDateTime(input: string | Date): string {
  const x = d(input);
  if (Number.isNaN(x.getTime())) return "—";
  return `${formatDate(x)}, ${pad(x.getUTCHours())}:${pad(x.getUTCMinutes())}`;
}
