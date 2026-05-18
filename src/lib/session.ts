export function getTodayDateString(): string {
  const now = new Date();
  const tz = "Asia/Taipei";
  return now.toLocaleDateString("en-CA", { timeZone: tz });
}

export function formatDurationMinutes(
  startIso: string,
  endIso: string
): number | null {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  return Math.round((end - start) / 60000);
}

export function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${y}/${m}/${d}`;
}
