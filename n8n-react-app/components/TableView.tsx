import React, { useMemo } from 'react';
import { RowData } from '../types';
import { Button } from './ui/Button';

interface TableViewProps {
  data: RowData[];
  isLoading: boolean;
  onEdit: (row: RowData) => void;
  onDelete: (id: string | number) => void;
}

export const TableView: React.FC<TableViewProps> = ({ data, isLoading, onEdit, onDelete }) => {
  // Dynamically extract columns from the first few records to ensure we capture keys
  // In a strict environment, we'd use a fixed schema, but requirements asked for adaptation
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const allKeys = new Set<string>();
    // Check first 5 items to gather keys just in case structure varies slightly
    data.slice(0, 5).forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    // Ensure 'id' is first if it exists
    const keys = Array.from(allKeys);
    const idIndex = keys.findIndex(k => k.toLowerCase() === 'id');
    if (idIndex > -1) {
      keys.splice(idIndex, 1);
      keys.unshift('id');
    }
    return keys;
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="text-gray-500 flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 mb-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading data...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white rounded-lg border border-gray-200">
        <span className="text-gray-500">No records found. Add one to get started.</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={`${row.id}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                     {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => onDelete(row.id)} className="text-red-600 hover:text-red-900">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
