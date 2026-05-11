import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Medicine, MedicineInput, MedicineStatus } from '../../types';
import { MEDICINE_CATEGORIES } from '../../types';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { useInventory } from './useInventory';
import { MedicineTable } from './MedicineTable';
import { MedicineFormModal } from './MedicineFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { getStatus, STATUS_LABELS } from '../alerts/alertUtils';
import { toast } from '../../lib/toast';

type CategoryFilter = 'all' | (typeof MEDICINE_CATEGORIES)[number];
type StatusFilter = 'all' | MedicineStatus;

const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'All categories' },
  ...MEDICINE_CATEGORIES.map((c) => ({ value: c, label: c })),
];

const STATUS_FILTER_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'expired', label: STATUS_LABELS.expired },
  { value: 'expiring-soon', label: STATUS_LABELS['expiring-soon'] },
  { value: 'low-stock', label: STATUS_LABELS['low-stock'] },
  { value: 'ok', label: STATUS_LABELS.ok },
];

export function InventoryPage() {
  const { medicines, add, update, remove } = useInventory();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Medicine | undefined>(undefined);
  const [deleting, setDeleting] = useState<Medicine | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return medicines.filter((m) => {
      if (query) {
        const haystack = `${m.name} ${m.supplier}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (categoryFilter !== 'all' && m.category !== categoryFilter)
        return false;
      if (statusFilter !== 'all' && getStatus(m) !== statusFilter) return false;
      return true;
    });
  }, [medicines, search, categoryFilter, statusFilter]);

  function openAdd() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(medicine: Medicine) {
    setEditing(medicine);
    setFormOpen(true);
  }

  function handleSubmit(input: MedicineInput) {
    if (editing) {
      update(editing.id, input);
      toast.success('Medicine updated', `${input.name} saved.`);
    } else {
      add(input);
      toast.success('Medicine added', `${input.name} added to inventory.`);
    }
    setFormOpen(false);
    setEditing(undefined);
  }

  function handleDeleteConfirm() {
    if (deleting) {
      const { name } = deleting;
      remove(deleting.id);
      toast.success('Medicine deleted', `${name} removed.`);
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {medicines.length} total &middot; {filtered.length} shown
          </p>
        </div>
        <Button
          leadingIcon={<Plus className="h-4 w-4" aria-hidden />}
          onClick={openAdd}
        >
          Add medicine
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          placeholder="Search by name or supplier"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leadingIcon={<Search className="h-4 w-4" />}
          aria-label="Search medicines"
        />
        <Select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as CategoryFilter)
          }
          options={CATEGORY_FILTER_OPTIONS}
        />
        <Select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          options={STATUS_FILTER_OPTIONS}
        />
      </div>

      <MedicineTable
        medicines={filtered}
        onEdit={openEdit}
        onDelete={(m) => setDeleting(m)}
      />

      <MedicineFormModal
        open={formOpen}
        initialValue={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(undefined);
        }}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal
        open={deleting !== null}
        medicineName={deleting?.name ?? null}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
