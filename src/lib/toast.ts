import { useSyncExternalStore } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

const AUTO_DISMISS_MS = 4000;

let items: ToastItem[] = [];
const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ToastItem[] {
  return items;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function add(
  variant: ToastVariant,
  title: string,
  description?: string,
): string {
  const id = generateId();
  const item: ToastItem = description
    ? { id, variant, title, description }
    : { id, variant, title };
  items = [...items, item];
  emit();
  timers.set(
    id,
    setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
  );
  return id;
}

function dismiss(id: string): void {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
  if (!items.some((t) => t.id === id)) return;
  items = items.filter((t) => t.id !== id);
  emit();
}

export const toast = {
  success: (title: string, description?: string) =>
    add('success', title, description),
  error: (title: string, description?: string) =>
    add('error', title, description),
  info: (title: string, description?: string) =>
    add('info', title, description),
  dismiss,
};

export function useToasts(): ToastItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
