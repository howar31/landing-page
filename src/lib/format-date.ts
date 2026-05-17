const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function absolute(d: Date): string {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function formatPostDate(input: string): string {
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  return absolute(d);
}

export function formatRelativeTime(input: string, now: Date = new Date()): string {
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days <= 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return absolute(d);
}
