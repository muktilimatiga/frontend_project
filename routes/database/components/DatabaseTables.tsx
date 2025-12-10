
import * as React from 'react';
import { Database, MoreHorizontal, Activity, Globe, Cpu, Layers, Plus, Table as TableIcon } from 'lucide-react';
import { 
  Card, CardContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Button,
  Badge,
  cn
} from '../../../components/ui';
import { useSupabaseTableStats } from '../../../hooks/useSupabaseTableStats';

export const DatabaseTables = ({ onSelectTable, onCreateTable }: { onSelectTable: (name: string) => void, onCreateTable: () => void }) => {
  const { tables, loading } = useSupabaseTableStats();

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your Supabase tables and collections.</p>
          </div>
          <Button onClick={onCreateTable} className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white">
            <Plus className="mr-2 h-4 w-4" /> New Table
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full py-12 text-center text-slate-500">Loading tables...</div>
          ) : tables.length === 0 ? (
             <div className="col-span-full py-12 text-center text-slate-500">
                No tables found or connection failed. Ensure your Supabase client is configured.
             </div>
          ) : (
             tables.map((table) => (
                <Card 
                   key={table.id} 
                   className="group hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer dark:bg-[#121214] dark:border-slate-800 hover:shadow-md"
                   onClick={() => onSelectTable(table.name)}
                >
                   <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                               <TableIcon className="h-6 w-6" />
                            </div>
                            <div>
                               <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{table.name}</h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                   <Badge 
                                      variant={table.status === 'active' ? 'success' : table.status === 'error' ? 'destructive' : 'secondary'} 
                                      className="uppercase text-[10px] h-5 px-1.5 font-bold tracking-wider"
                                   >
                                      {table.status}
                                   </Badge>
                                   <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Public Schema</span>
                                </div>
                            </div>
                         </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger>
                               <Button variant="ghost" className="h-8 w-8 p-0 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                  <MoreHorizontal className="h-5 w-5" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuItem onClick={() => onSelectTable(table.name)}>View Data</DropdownMenuItem>
                               <DropdownMenuItem>Edit Schema</DropdownMenuItem>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem className="text-red-600 dark:text-red-400">Truncate</DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                         <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                               <Layers className="h-3.5 w-3.5" /> Row Count
                            </div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{table.rowCount}</p>
                         </div>
                         <div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                               <Activity className="h-3.5 w-3.5" /> Connection
                            </div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{table.lastSynced}</p>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between text-xs items-end">
                            <span className="text-slate-500 dark:text-slate-400">Capacity (Est.)</span>
                            <span className="font-bold text-slate-900 dark:text-white">Good</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                table.status === 'error' ? "bg-red-500" : "bg-emerald-500"
                              )}
                              style={{ width: table.status === 'error' ? '100%' : '25%' }} 
                            />
                         </div>
                      </div>
                   </CardContent>
                </Card>
             ))
          )}

          {/* New Table Card */}
          <div 
             onClick={onCreateTable}
             className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all gap-4 group min-h-[320px]"
          >
             <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors shadow-sm">
                <Plus className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400" />
             </div>
             <div className="text-center">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">New Table</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a new schema</p>
             </div>
          </div>
       </div>
    </div>
  );
};
