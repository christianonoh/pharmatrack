import { useEffect, useState, type FormEvent } from 'react';
import type { Medicine, MedicineInput } from '../../types';
import { MEDICINE_CATEGORIES } from '../../types';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';

interface MedicineFormModalProps {
  open: boolean;
  initialValue?: Medicine;
  onClose: () => void;
  onSubmit: (input: MedicineInput) => void;
}

interface FormState {
  name: string;
  supplier: string;
  category: string;
  quantity: string;
  minQuantityThreshold: string;
  expiryDate: string;
  price: string;
}

function toFormState(medicine?: Medicine): FormState {
  return {
    name: medicine?.name ?? '',
    supplier: medicine?.supplier ?? '',
    category: medicine?.category ?? MEDICINE_CATEGORIES[0],
    quantity: medicine ? String(medicine.quantity) : '',
    minQuantityThreshold: medicine
      ? String(medicine.minQuantityThreshold)
      : '',
    expiryDate: medicine?.expiryDate ?? '',
    price: medicine ? String(medicine.price) : '',
  };
}

const CATEGORY_OPTIONS = MEDICINE_CATEGORIES.map((c) => ({
  value: c,
  label: c,
}));

export function MedicineFormModal({
  open,
  initialValue,
  onClose,
  onSubmit,
}: MedicineFormModalProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialValue));

  useEffect(() => {
    if (open) setForm(toFormState(initialValue));
  }, [open, initialValue]);

  const isEdit = Boolean(initialValue);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input: MedicineInput = {
      name: form.name.trim(),
      supplier: form.supplier.trim(),
      category: form.category,
      quantity: Number(form.quantity),
      minQuantityThreshold: Number(form.minQuantityThreshold),
      expiryDate: form.expiryDate,
      price: Number(form.price),
    };
    onSubmit(input);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit medicine' : 'Add medicine'}
      description={
        isEdit
          ? 'Update the medicine details below.'
          : 'Fill in the details to add a medicine to your inventory.'
      }
      size="lg"
    >
      <form
        id="medicine-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <Input
          label="Name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="e.g. Amoxicillin 500mg"
          wrapperClassName="sm:col-span-2"
          autoFocus
        />
        <Input
          label="Supplier"
          required
          value={form.supplier}
          onChange={(e) => update('supplier', e.target.value)}
          placeholder="e.g. Emzor Pharmaceuticals"
        />
        <Select
          label="Category"
          required
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          options={CATEGORY_OPTIONS}
        />
        <Input
          label="Quantity"
          type="number"
          required
          min={0}
          step={1}
          value={form.quantity}
          onChange={(e) => update('quantity', e.target.value)}
        />
        <Input
          label="Low-stock threshold"
          type="number"
          required
          min={0}
          step={1}
          value={form.minQuantityThreshold}
          onChange={(e) => update('minQuantityThreshold', e.target.value)}
          hint="Trigger low-stock alert below this number."
        />
        <Input
          label="Expiry date"
          type="date"
          required
          value={form.expiryDate}
          onChange={(e) => update('expiryDate', e.target.value)}
        />
        <Input
          label="Unit price (₦)"
          type="number"
          required
          min={0}
          step="0.01"
          value={form.price}
          onChange={(e) => update('price', e.target.value)}
        />
        <div className="flex items-center justify-end gap-2 sm:col-span-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEdit ? 'Save changes' : 'Add medicine'}</Button>
        </div>
      </form>
    </Modal>
  );
}
