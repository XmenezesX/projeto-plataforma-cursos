import React from "react";

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function Table<T extends { id?: string | number; [key: string]: any }>({
  columns,
  data,
  emptyMessage = "Nenhum registro encontrado.",
}: TableProps<T>) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-3">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const itemKey = item.id ?? item[Object.keys(item).find(k => k.startsWith("ID_")) || ""] ?? index;
              return (
                <tr key={String(itemKey)}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
