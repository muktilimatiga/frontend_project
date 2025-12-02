
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ModalOverlay, Button, Label, Input, Textarea } from '../../../components/ui';

interface RowEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData: any;
  columns: string[]; 
  tableName: string;
}

export const RowEditorModal = ({ isOpen, onClose, onSave, initialData, columns, tableName }: RowEditorModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
        await onSave(formData);
        onClose();
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter out columns that are typically auto-managed or shouldn't be edited by default
  const editableColumns = columns.filter(col => 
    col !== 'id' && 
    col !== 'created_at' && 
    col !== 'updated_at' &&
    !col.endsWith('_generated')
  );

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {initialData ? `Edit Record in ${tableName}` : `Insert into ${tableName}`}
            </h2>
        </div>
        
        <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {editableColumns.length === 0 && (
                <div className="text-sm text-slate-500 text-center py-4">
                    No editable columns found.
                </div>
            )}
            {editableColumns.map(col => (
                <div key={col} className="space-y-1.5">
                    <Label className="capitalize text-xs font-medium text-slate-500">{col.replace(/_/g, ' ')}</Label>
                    {col.length > 50 ? (
                        <Textarea 
                            value={formData[col] || ''}
                            onChange={e => handleChange(col, e.target.value)}
                            placeholder={`Enter ${col}...`}
                            className="text-sm"
                        />
                    ) : (
                        <Input 
                            value={formData[col] || ''}
                            onChange={e => handleChange(col, e.target.value)}
                            placeholder={`Enter ${col}...`}
                            className="text-sm"
                        />
                    )}
                </div>
            ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-white/10">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 text-white hover:bg-indigo-700">
                {loading ? 'Saving...' : 'Save Record'}
            </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};
