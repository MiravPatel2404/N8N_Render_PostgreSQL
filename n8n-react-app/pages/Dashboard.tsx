import React, { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { TableView } from '../components/TableView';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { AddForm } from '../components/AddForm';
import { EditForm } from '../components/EditForm';
import { FindById } from '../components/FindById';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { RowData } from '../types';

export const Dashboard: React.FC = () => {
  const { data, status, error, addRow, updateRow, deleteRow, refresh } = useSheetData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<RowData | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract columns for the Add Form
  const availableColumns = React.useMemo(() => {
    if (data.length > 0) return Object.keys(data[0]);
    return ['name', 'email', 'status']; // Fallback default columns if empty
  }, [data]);

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    await deleteRow(deletingId);
    setIsDeleting(false);
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sheet Manager</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your Google Sheet data securely.</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={refresh} disabled={status === 'loading'}>
              Refresh
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              + Add Record
            </Button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Find Section */}
        <FindById />

        {/* List Section */}
        <TableView 
          data={data} 
          isLoading={status === 'loading'} 
          onEdit={setEditingRow} 
          onDelete={setDeletingId} 
        />

        {/* Modals */}
        <Modal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          title="Add New Record"
        >
          <AddForm 
            onAdd={addRow} 
            existingColumns={availableColumns} 
            onCancel={() => setIsAddModalOpen(false)} 
          />
        </Modal>

        <Modal 
          isOpen={!!editingRow} 
          onClose={() => setEditingRow(null)} 
          title="Edit Record"
        >
          {editingRow && (
            <EditForm 
              data={editingRow} 
              onUpdate={updateRow} 
              onCancel={() => setEditingRow(null)} 
            />
          )}
        </Modal>

        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Record"
          message="Are you sure you want to delete this record? This action cannot be undone."
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};
