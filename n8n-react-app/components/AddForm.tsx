import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { sanitizeInput } from '../utils/validators';
import { RowData } from '../types';

interface AddFormProps {
  onAdd: (data: Omit<RowData, 'id'>) => Promise<any>;
  existingColumns: string[];
  onCancel: () => void;
}

export const AddForm: React.FC<AddFormProps> = ({ onAdd, existingColumns, onCancel }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter out 'id' from columns to populate
  const fields = existingColumns.filter(col => col.toLowerCase() !== 'id');

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
      // Basic validation
      if (Object.keys(formData).length === 0) {
        throw new Error('Please fill in at least one field.');
      }

      const sanitizedData: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        sanitizedData[key] = sanitizeInput(value as string);
      });

      const result = await onAdd(sanitizedData);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add record');
      }
      onCancel(); // Close form on success
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
      
      <div className="grid grid-cols-1 gap-4">
        {fields.length > 0 ? (
          fields.map(field => (
            <Input
              key={field}
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              placeholder={`Enter ${field}...`}
              onChange={handleChange}
              value={formData[field] || ''}
            />
          ))
        ) : (
           <div className="text-gray-500 text-sm italic">
             No columns detected. Please ensure your sheet has headers or add a record manually via your provider first.
           </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Record
        </Button>
      </div>
    </form>
  );
};