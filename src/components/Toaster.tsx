import { toast, useToasts } from '../lib/toast';
import { Toast } from './Toast';

export function Toaster() {
  const items = useToasts();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 flex flex-col-reverse gap-2 sm:left-auto sm:right-4 sm:w-80"
    >
      {items.map((item) => (
        <Toast
          key={item.id}
          toast={item}
          onClose={() => toast.dismiss(item.id)}
        />
      ))}
    </div>
  );
}
