import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  wrapperClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  leadingIcon,
  className,
  wrapperClassName,
  id,
  ...rest
}: InputProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const describedById = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className={cn('w-full', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById}
          className={cn(
            'block h-10 w-full rounded-lg border bg-white text-sm text-zinc-900 placeholder:text-zinc-400',
            'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-zinc-400',
            'disabled:bg-zinc-50 disabled:text-zinc-500',
            leadingIcon ? 'pl-9 pr-3' : 'px-3',
            error
              ? 'border-red-300 focus:outline-red-600'
              : 'border-zinc-200',
            className,
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
