import React from 'react';
import { Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui';

const tables = [
  { name: 'users', rows: 12405, size: '45 MB', lastUpdated: '2 mins ago' },
  { name: 'tickets', rows: 84320, size: '128 MB', lastUpdated: '1 min ago' },
  { name: 'logs', rows: 1542001, size: '2.4 GB', lastUpdated: 'Just now' },
  { name: 'configs', rows: 540, size: '1.2 MB', lastUpdated: '4 hours ago' },
  { name: 'sessions', rows: 45, size: '0.5 MB', lastUpdated: 'Live' },
];

export const DatabaseTables = () => {
  return (
    <Card className="md:col-span-2 dark:bg-black dark:border-white/20">
       <CardHeader>
          <CardTitle className="text-base">Public Schema Tables</CardTitle>
       </CardHeader>
       <CardContent>
          <div className="space-y-1">
             {tables.map((table) => (
                <div key={table.name} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors cursor-pointer group">
                   <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                      <div>
                         <p className="font-medium text-sm text-slate-900 dark:text-slate-200">{table.name}</p>
                         <p className="text-xs text-slate-500">{table.lastUpdated}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{table.rows.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">{table.size}</p>
                   </div>
                </div>
             ))}
          </div>
       </CardContent>
    </Card>
  );
};