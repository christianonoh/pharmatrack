import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

export function Select({
  label,
  options,
  placeholder,
  className,
  wrapperClassName,
  id,
  ...rest
}: SelectProps) {
  const reactId = useId();
  const selectId = id ?? reactId;

  return (
    <div className={cn('w-full', wrapperClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-zinc-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'block h-10 w-full appearance-none rounded-lg border border-zinc-200 bg-white pl-3 pr-9 text-sm text-zinc-900',
            'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-zinc-400',
            'disabled:bg-zinc-50 disabled:text-zinc-500',
            className,
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        />
      </div>
    </div>
  );
}
