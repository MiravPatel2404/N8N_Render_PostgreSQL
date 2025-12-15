import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { sanitizeInput } from '../utils/validators';
import { RowData } from '../types';

interface EditFormProps {
  data: RowData;
  onUpdate: (id: string | number, data: Partial<RowData>) => Promise<any>;
  onCancel: () => void;
}

export const EditForm: React.FC<EditFormProps> = ({ data, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, any>>({ ...data });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const sanitizedData: Record<string, any> = {};
      
      // Compare with original and only send changes + valid fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'id') return; // Don't send ID in body usually, handled by URL
        sanitizedData[key] = typeof value === 'string' ? sanitizeInput(value) : value;
      });

      const result = await onUpdate(data.id, sanitizedData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update record');
      }
      onCancel();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2">
        {Object.keys(data).map(key => (
          <div key={key}>
             {key === 'id' ? (
               <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-500 mb-1">ID (Read-only)</label>
                 <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 text-sm">
                   {String(data[key])}
                 </div>
               </div>
             ) : (
                <Input
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={formData[key] || ''}
                  onChange={handleChange}
                />
             )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};
