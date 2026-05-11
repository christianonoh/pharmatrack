import type { Medicine, MedicineInput } from '../types';
import type { InventoryStorage } from './storage';
import { buildSeedMedicines } from './seedData';

const STORAGE_KEY = 'pharmatrack:medicines:v1';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export class LocalStorageInventory implements InventoryStorage {
  constructor() {
    this.ensureSeeded();
  }

  getMedicines(): Medicine[] {
    return this.read();
  }

  getMedicineById(id: string): Medicine | undefined {
    return this.read().find((m) => m.id === id);
  }

  addMedicine(input: MedicineInput): Medicine {
    const medicine: Medicine = { id: generateId(), ...input };
    const next = [...this.read(), medicine];
    this.write(next);
    return medicine;
  }

  updateMedicine(id: string, patch: Partial<MedicineInput>): Medicine {
    const medicines = this.read();
    const index = medicines.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Medicine not found: ${id}`);
    }
    const current = medicines[index]!;
    const updated: Medicine = { ...current, ...patch };
    const next = [...medicines];
    next[index] = updated;
    this.write(next);
    return updated;
  }

  deleteMedicine(id: string): void {
    const next = this.read().filter((m) => m.id !== id);
    this.write(next);
  }

  private ensureSeeded(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      this.write(buildSeedMedicines());
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        this.write(buildSeedMedicines());
      }
    } catch {
      this.write(buildSeedMedicines());
    }
  }

  private read(): Medicine[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return [];
      const parsed = JSON.parse(raw) as Medicine[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(medicines: Medicine[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
  }
}
