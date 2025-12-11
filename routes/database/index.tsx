
import * as React from 'react';
import { useState } from 'react';
import { Database, Download } from 'lucide-react';
import { Button } from '../../components/ui';
import { DatabaseTables } from './components/DatabaseTables';
import { TableDataView } from './components/TableDataView';
import { BackupModal, ExportModal, CreateTableModal } from './components/DatabaseModals';

export const DatabasePage = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'backup' | 'export' | 'create_table'>('none');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 py-8">
      <BackupModal isOpen={activeModal === 'backup'} onClose={() => setActiveModal('none')} />
      <ExportModal isOpen={activeModal === 'export'} onClose={() => setActiveModal('none')} />
      <CreateTableModal isOpen={activeModal === 'create_table'} onClose={() => setActiveModal('none')} />

      {selectedTable ? (
         <TableDataView tableName={selectedTable} onBack={() => setSelectedTable(null)} />
      ) : (
         <div className="w-full">
            <DatabaseTables 
               onSelectTable={setSelectedTable} 
               onCreateTable={() => setActiveModal('create_table')}
            />
         </div>
      )}
    </div>
  );
};
