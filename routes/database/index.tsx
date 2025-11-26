
import * as React from 'react';
import { useState } from 'react';
import { Database, Download } from 'lucide-react';
import { Button } from '../../components/ui';
import { DatabaseTables } from './components/DatabaseTables';
import { TableDataView } from './components/TableDataView';
import { BackupModal, ExportModal } from './components/DatabaseModals';

export const DatabasePage = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'backup' | 'export'>('none');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <BackupModal isOpen={activeModal === 'backup'} onClose={() => setActiveModal('none')} />
      <ExportModal isOpen={activeModal === 'export'} onClose={() => setActiveModal('none')} />

      {selectedTable ? (
         <TableDataView tableName={selectedTable} onBack={() => setSelectedTable(null)} />
      ) : (
         <div className="w-full">
            <DatabaseTables onSelectTable={setSelectedTable} />
         </div>
      )}
    </div>
  );
};
