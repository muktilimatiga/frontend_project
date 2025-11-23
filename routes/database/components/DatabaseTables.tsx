import * as React from 'react';
import { Database, FileJson, Table, Eye, MoreHorizontal, Download } from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardContent, 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Button
} from '../../../components/ui';

const tables = [
  { name: 'users', rows: 12405, size: '45 MB', lastUpdated: '2 mins ago' },
  { name: 'tickets', rows: 84320, size: '128 MB', lastUpdated: '1 min ago' },
  { name: 'logs', rows: 1542001, size: '2.4 GB', lastUpdated: 'Just now' },
  { name: 'configs', rows: 540, size: '1.2 MB', lastUpdated: '4 hours ago' },
  { name: 'sessions', rows: 45, size: '0.5 MB', lastUpdated: 'Live' },
];

export const DatabaseTables = ({ onSelectTable }: { onSelectTable: (name: string) => void }) => {
  return (
    <Card className="md:col-span-2 dark:bg-black dark:border-white/20">
       <CardHeader>
          <CardTitle className="text-base">Public Schema Tables</CardTitle>
       </CardHeader>
       <CardContent>
          <div className="space-y-1">
             {tables.map((table) => (
                <div 
                  key={table.name} 
                  className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-colors cursor-pointer group"
                  onClick={() => onSelectTable(table.name)}
                >
                   <div className="flex items-center gap-3">
                      <Database className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                      <div>
                         <p className="font-medium text-sm text-slate-900 dark:text-slate-200 capitalize">{table.name}</p>
                         <p className="text-xs text-slate-500">{table.lastUpdated}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                          <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{table.rows.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{table.size}</p>
                      </div>
                      <DropdownMenu>
                         <DropdownMenuTrigger>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                               <MoreHorizontal className="h-4 w-4" />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelectTable(table.name)}>
                               <Eye className="mr-2 h-4 w-4" /> View Data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert('Downloading CSV...')}>
                               <Download className="mr-2 h-4 w-4" /> Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                               <Table className="mr-2 h-4 w-4" /> Schema Info
                            </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>
             ))}
          </div>
       </CardContent>
    </Card>
  );
};