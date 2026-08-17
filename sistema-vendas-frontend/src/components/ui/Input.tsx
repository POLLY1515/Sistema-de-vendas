import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-1" htmlFor={inputId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        id={inputId}
        className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
