import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';

interface DeleteConfirmModalProps {
  open: boolean;
  medicineName: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  open,
  medicineName,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Delete medicine"
      description="This action cannot be undone."
      size="sm"
    >
      <p className="text-sm text-zinc-700">
        Are you sure you want to delete{' '}
        <span className="font-medium text-zinc-900">
          {medicineName ?? 'this medicine'}
        </span>
        ? It will be removed from your inventory permanently.
      </p>
      <div className="mt-5 flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
