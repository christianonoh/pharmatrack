import { useEffect, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastItem, ToastVariant } from '../lib/toast';
import { cn } from '../lib/cn';

interface ToastProps {
  toast: ToastItem;
  onClose: () => void;
}

const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4" aria-hidden />,
  error: <AlertCircle className="h-4 w-4" aria-hidden />,
  info: <Info className="h-4 w-4" aria-hidden />,
};

const ICON_STYLES: Record<ToastVariant, string> = {
  success: 'bg-emerald-50 text-emerald-600',
  error: 'bg-red-50 text-red-600',
  info: 'bg-zinc-100 text-zinc-600',
};

export function Toast({ toast, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg',
        'transition-all duration-200 ease-out',
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2',
      )}
      role="status"
    >
      <span
        className={cn(
          'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg',
          ICON_STYLES[toast.variant],
        )}
      >
        {ICONS[toast.variant]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-zinc-500">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="flex-shrink-0 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
