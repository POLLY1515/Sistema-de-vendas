import type { TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({
  label,
  error,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <label className="block space-y-1" htmlFor={textareaId}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        {...props}
        id={textareaId}
        className={`min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
