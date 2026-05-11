import { useCallback, useState } from 'react';
import type { Medicine, MedicineInput } from '../../types';
import { getStorage } from '../../services/storage';

export function useInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>(() =>
    getStorage().getMedicines(),
  );

  const refresh = useCallback(() => {
    setMedicines(getStorage().getMedicines());
  }, []);

  const add = useCallback(
    (input: MedicineInput): Medicine => {
      const created = getStorage().addMedicine(input);
      refresh();
      return created;
    },
    [refresh],
  );

  const update = useCallback(
    (id: string, patch: Partial<MedicineInput>): Medicine => {
      const updated = getStorage().updateMedicine(id, patch);
      refresh();
      return updated;
    },
    [refresh],
  );

  const remove = useCallback(
    (id: string): void => {
      getStorage().deleteMedicine(id);
      refresh();
    },
    [refresh],
  );

  return { medicines, add, update, remove, refresh };
}
