import type { Medicine, MedicineInput } from '../types';
import { LocalStorageInventory } from './localStorage';

export interface InventoryStorage {
  getMedicines(): Medicine[];
  getMedicineById(id: string): Medicine | undefined;
  addMedicine(input: MedicineInput): Medicine;
  updateMedicine(id: string, patch: Partial<MedicineInput>): Medicine;
  deleteMedicine(id: string): void;
}

let instance: InventoryStorage | null = null;

export function getStorage(): InventoryStorage {
  if (!instance) {
    instance = new LocalStorageInventory();
  }
  return instance;
}
