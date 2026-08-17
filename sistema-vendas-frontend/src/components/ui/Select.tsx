import type { ReactNode, SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  children: ReactNode;
};

export function Select({
  label,
  error,
  children,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="block space-y-1" htmlFor={selectId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        {...props}
        id={selectId}
        className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
