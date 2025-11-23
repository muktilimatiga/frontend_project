import React from 'react';
import { Database } from 'lucide-react';
import { Button } from '../../components/ui';
import { DatabaseTables } from './components/DatabaseTables';
import { DatabaseSidebar } from './components/DatabaseSidebar';

export const DatabasePage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Database Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Schema overview and maintenance tools.</p>
         </div>
         <Button><Database className="mr-2 h-4 w-4" /> New Backup</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <DatabaseTables />
         <DatabaseSidebar />
      </div>
    </div>
  );
};