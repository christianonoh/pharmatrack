import type { Medicine, MedicineStatus } from '../../types';
import { isExpired, isExpiringSoon } from '../../lib/date';

export const EXPIRING_SOON_WINDOW_DAYS = 30;

export function isLowStock(medicine: Medicine): boolean {
  return medicine.quantity < medicine.minQuantityThreshold;
}

export function getStatus(medicine: Medicine): MedicineStatus {
  if (isExpired(medicine.expiryDate)) return 'expired';
  if (isExpiringSoon(medicine.expiryDate, EXPIRING_SOON_WINDOW_DAYS))
    return 'expiring-soon';
  if (isLowStock(medicine)) return 'low-stock';
  return 'ok';
}

export function getExpired(medicines: Medicine[]): Medicine[] {
  return medicines.filter((m) => isExpired(m.expiryDate));
}

export function getExpiringSoon(medicines: Medicine[]): Medicine[] {
  return medicines.filter(
    (m) =>
      !isExpired(m.expiryDate) &&
      isExpiringSoon(m.expiryDate, EXPIRING_SOON_WINDOW_DAYS),
  );
}

export function getLowStock(medicines: Medicine[]): Medicine[] {
  return medicines.filter((m) => isLowStock(m));
}

export function getTotalValue(medicines: Medicine[]): number {
  return medicines.reduce((sum, m) => sum + m.quantity * m.price, 0);
}

export function getCountByCategory(
  medicines: Medicine[],
): Array<{ category: string; count: number }> {
  const counts = new Map<string, number>();
  for (const m of medicines) {
    counts.set(m.category, (counts.get(m.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export const STATUS_LABELS: Record<MedicineStatus, string> = {
  expired: 'Expired',
  'expiring-soon': 'Expiring Soon',
  'low-stock': 'Low Stock',
  ok: 'OK',
};
