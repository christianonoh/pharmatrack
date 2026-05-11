export interface Medicine {
  id: string;
  name: string;
  supplier: string;
  category: string;
  quantity: number;
  minQuantityThreshold: number;
  expiryDate: string;
  price: number;
}

export type MedicineInput = Omit<Medicine, 'id'>;

export type MedicineStatus = 'expired' | 'expiring-soon' | 'low-stock' | 'ok';

export const MEDICINE_CATEGORIES = [
  'Antibiotics',
  'Analgesics',
  'Antivirals',
  'Vitamins',
  'Antihistamines',
  'Cardiovascular',
  'Gastrointestinal',
  'Respiratory',
  'Other',
] as const;

export type MedicineCategory = (typeof MEDICINE_CATEGORIES)[number];
