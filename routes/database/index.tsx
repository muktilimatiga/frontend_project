import * as React from 'react';
import { useState } from 'react';
import { Database, Download } from 'lucide-react';
import { Button } from '../../components/ui';
import { DatabaseTables } from './components/DatabaseTables';
import { DatabaseSidebar } from './components/DatabaseSidebar';
import { TableDataView } from './components/TableDataView';
import { BackupModal, ExportModal } from './components/DatabaseModals';

export const DatabasePage = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'none' | 'backup' | 'export'>('none');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <BackupModal isOpen={activeModal === 'backup'} onClose={() => setActiveModal('none')} />
      <ExportModal isOpen={activeModal === 'export'} onClose={() => setActiveModal('none')} />

      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Database Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Schema overview and maintenance tools.</p>
         </div>
         <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveModal('export')}>
               <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button onClick={() => setActiveModal('backup')}>
               <Database className="mr-2 h-4 w-4" /> New Backup
            </Button>
         </div>
      </div>

      {selectedTable ? (
         <TableDataView tableName={selectedTable} onBack={() => setSelectedTable(null)} />
      ) : (
         <div className="grid md:grid-cols-3 gap-6">
            <DatabaseTables onSelectTable={setSelectedTable} />
            <DatabaseSidebar />
         </div>
      )}
    </div>
  );
};