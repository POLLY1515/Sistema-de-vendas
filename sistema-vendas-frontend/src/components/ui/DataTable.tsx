import type { ReactNode } from 'react';

export type Column<T> = {
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
};

export function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`px-4 py-3 text-left font-semibold text-slate-600 ${column.className ?? ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-4 py-3 text-slate-700 ${column.className ?? ''}`}
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
