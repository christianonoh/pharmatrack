const MS_PER_DAY = 86_400_000;

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfDay(iso: string): number {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function daysUntil(iso: string): number {
  return Math.round((startOfDay(iso) - startOfToday()) / MS_PER_DAY);
}

export function isExpired(iso: string): boolean {
  return daysUntil(iso) < 0;
}

export function isExpiringSoon(iso: string, withinDays = 30): boolean {
  const days = daysUntil(iso);
  return days >= 0 && days <= withinDays;
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso));
}

export function isoDaysFromToday(offsetDays: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
