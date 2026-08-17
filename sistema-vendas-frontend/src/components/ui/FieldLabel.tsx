import type { ReactNode } from "react";

type FieldLabelProps = {
  htmlFor: string;
  children: ReactNode;
};

export function FieldLabel({
  htmlFor,
  children,
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-sm font-medium text-slate-700"
    >
      {children}
    </label>
  );
}
