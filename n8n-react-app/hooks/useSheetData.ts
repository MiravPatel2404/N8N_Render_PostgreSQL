import { useState, useCallback, useEffect } from 'react';
import { sheetApi } from '../services/sheetApi';
import { RowData, FetchStatus } from '../types';

export const useSheetData = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await sheetApi.listRows();
      // Ensure result is an array
      if (Array.isArray(result)) {
        setData(result);
      } else if (result && typeof result === 'object' && Array.isArray((result as any).data)) {
         // Handle wrapped responses { data: [...] }
         setData((result as any).data);
      } else {
        setData([]);
        console.warn('API returned non-array data structure:', result);
      }
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setStatus('error');
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRow = async (newData: Omit<RowData, 'id'>) => {
    try {
      await sheetApi.addRow(newData);
      await fetchData(); // Refresh list
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateRow = async (id: string | number, updatedData: Partial<RowData>) => {
    try {
      await sheetApi.updateRow(id, updatedData);
      await fetchData(); // Refresh list
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteRow = async (id: string | number) => {
    try {
      await sheetApi.deleteRow(id);
      setData((prev) => prev.filter((item) => String(item.id) !== String(id))); // Optimistic update
      return { success: true };
    } catch (err: any) {
      await fetchData(); // Revert on failure
      return { success: false, error: err.message };
    }
  };

  return {
    data,
    status,
    error,
    refresh: fetchData,
    addRow,
    updateRow,
    deleteRow,
  };
};
