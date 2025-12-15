import React, { useState } from 'react';
import { sheetApi } from '../services/sheetApi';
import { RowData } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const FindById: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<RowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setNotFound(false);

    try {
      const data = await sheetApi.findRow(searchId);
      // Logic assumes API returns null or empty object if not found, or throws 404
      if (data && Object.keys(data).length > 0) {
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch (err: any) {
      setError("Failed to fetch record. It may not exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Record by ID</h2>
      <form onSubmit={handleSearch} className="flex gap-4 items-end mb-4">
        <div className="flex-1">
          <Input 
            placeholder="Enter ID..." 
            value={searchId} 
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <Button type="submit" isLoading={loading} disabled={!searchId.trim()}>
          Search
        </Button>
      </form>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      
      {notFound && (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
          No record found with ID "{searchId}".
        </div>
      )}

      {result && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b font-medium text-gray-700">Result Details</div>
          <div className="p-4 bg-gray-50 space-y-2">
             {Object.entries(result).map(([key, value]) => (
               <div key={key} className="grid grid-cols-3 gap-4 border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                 <span className="font-medium text-gray-600 col-span-1">{key}:</span>
                 <span className="col-span-2 text-gray-900 break-all">{String(value)}</span>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};
