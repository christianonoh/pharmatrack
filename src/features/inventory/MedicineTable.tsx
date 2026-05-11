import { Pencil, Trash2 } from 'lucide-react';
import type { Medicine } from '../../types';
import { Table, type Column } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { formatDate, daysUntil } from '../../lib/date';
import { formatNaira } from '../../lib/currency';
import { getStatus, isLowStock, STATUS_LABELS } from '../alerts/alertUtils';

interface MedicineTableProps {
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicine: Medicine) => void;
}

function ExpiryCell({ medicine }: { medicine: Medicine }) {
  const status = getStatus(medicine);
  const days = daysUntil(medicine.expiryDate);
  let hint = '';
  if (status === 'expired') hint = `${Math.abs(days)}d ago`;
  else if (status === 'expiring-soon') hint = `in ${days}d`;
  return (
    <div className="flex flex-col">
      <span className="text-zinc-900">{formatDate(medicine.expiryDate)}</span>
      {hint && <span className="text-xs text-zinc-500">{hint}</span>}
    </div>
  );
}

function StatusCell({ medicine }: { medicine: Medicine }) {
  const status = getStatus(medicine);
  if (status === 'ok') {
    return <span className="text-xs text-zinc-400">&mdash;</span>;
  }
  return <Badge variant={status}>{STATUS_LABELS[status]}</Badge>;
}

function QuantityCell({ medicine }: { medicine: Medicine }) {
  const low = isLowStock(medicine);
  return (
    <div className="flex flex-col">
      <span className={low ? 'text-amber-700 font-medium' : 'text-zinc-900'}>
        {medicine.quantity}
      </span>
      <span className="text-xs text-zinc-500">
        min {medicine.minQuantityThreshold}
      </span>
    </div>
  );
}

export function MedicineTable({
  medicines,
  onEdit,
  onDelete,
}: MedicineTableProps) {
  const columns: Column<Medicine>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (m) => (
        <div className="flex flex-col">
          <span className="font-medium text-zinc-900">{m.name}</span>
          <span className="text-xs text-zinc-500">{m.supplier}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (m) => m.category,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      align: 'right',
      render: (m) => <QuantityCell medicine={m} />,
    },
    {
      key: 'expiryDate',
      header: 'Expiry',
      render: (m) => <ExpiryCell medicine={m} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => <StatusCell medicine={m} />,
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      render: (m) => formatNaira(m.price),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      render: (m) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(m)}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label={`Edit ${m.name}`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(m)}
            className="rounded-md p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${m.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={medicines}
      getRowKey={(m) => m.id}
      emptyState="No medicines match your filters."
    />
  );
}
