import { ReactNode } from 'react';

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

export default function Table<T extends { id?: string | number }>({
  data,
  columns,
  rowKey,
}: {
  data: T[];
  columns: Column<T>[];
  rowKey?: (row: T, index: number) => string | number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="w-full min-w-160 border-collapse">
        <thead>
          <tr className="bg-zinc-50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="border-b border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={rowKey ? rowKey(row, index) : row.id ?? index}
              className="border-b border-zinc-100 last:border-b-0"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-sm text-zinc-700">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
