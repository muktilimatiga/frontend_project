import * as React from 'react';
import { Database, MoreHorizontal, Activity, Globe, Cpu, Layers, Plus } from 'lucide-react';
import { 
  Card, CardContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Button,
  Badge,
  cn
} from '../../../components/ui';

// Mock Data matching the design requirements
const databases = [
  { id: 'db-1', name: 'cache_store_v2', type: 'Redis', region: 'us-east-1', size: '16GB / 2vCPU', lastSynced: '30 secs ago', status: 'online', tables: 0, storage: 89, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-900/30' },
  { id: 'db-2', name: 'production_db', type: 'PostgreSQL', region: 'us-east-1', size: '64GB / 8vCPU', lastSynced: '2 mins ago', status: 'online', tables: 142, storage: 78, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30' },
  { id: 'db-3', name: 'legacy_archived_2023', type: 'MongoDB', region: 'ap-northeast-1', size: '16GB / 2vCPU', lastSynced: '2 months ago', status: 'offline', tables: 12, storage: 95, color: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
  { id: 'db-4', name: 'analytics_warehouse', type: 'PostgreSQL', region: 'eu-central-1', size: '128GB / 16vCPU', lastSynced: 'Syncing...', status: 'syncing', tables: 24, storage: 12, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-900/30' },
  { id: 'db-5', name: 'staging_cluster', type: 'MySQL', region: 'us-west-2', size: '32GB / 4vCPU', lastSynced: '1 hour ago', status: 'online', tables: 86, storage: 45, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/30' },
];

export const DatabaseTables = ({ onSelectTable }: { onSelectTable: (name: string) => void }) => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Databases</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your cloud database instances and clusters.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:text-white">
            <Plus className="mr-2 h-4 w-4" /> New Database
          </Button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {databases.map((db) => (
             <Card 
                key={db.id} 
                className="group hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer dark:bg-card dark:border-slate-800 hover:shadow-md"
                onClick={() => onSelectTable(db.name)}
             >
                <CardContent className="p-6">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                         <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/5", db.color)}>
                            <Database className="h-6 w-6" />
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{db.name}</h3>
                             <div className="flex items-center gap-2 mt-1.5">
                                <Badge variant={db.status === 'online' ? 'success' : db.status === 'offline' ? 'secondary' : 'default'} className={cn("uppercase text-[10px] h-5 px-1.5 font-bold tracking-wider", db.status === 'syncing' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300")}>
                                   {db.status}
                                </Badge>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• {db.type}</span>
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
                            <DropdownMenuItem onClick={() => onSelectTable(db.name)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Backup Now</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">Terminate</DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                      <div>
                         <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                            <Globe className="h-3.5 w-3.5" /> Region
                         </div>
                         <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{db.region}</p>
                      </div>
                      <div>
                         <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                            <Cpu className="h-3.5 w-3.5" /> Size
                         </div>
                         <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{db.size}</p>
                      </div>
                       <div>
                         <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                            <Activity className="h-3.5 w-3.5" /> Last Synced
                         </div>
                         <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{db.lastSynced}</p>
                      </div>
                      <div>
                         <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                            <Layers className="h-3.5 w-3.5" /> Tables
                         </div>
                         <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{db.tables}</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-xs items-end">
                         <span className="text-slate-500 dark:text-slate-400">Storage</span>
                         <span className="font-bold text-slate-900 dark:text-white">{db.storage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div 
                           className={cn("h-full rounded-full transition-all duration-500", 
                             db.storage > 90 ? "bg-red-500" : db.storage > 75 ? "bg-orange-500" : db.storage < 20 ? "bg-indigo-500" : "bg-emerald-500" 
                           )} 
                           style={{ width: `${db.storage}%` }} 
                         />
                      </div>
                   </div>
                </CardContent>
             </Card>
          ))}

          {/* New Database Card */}
          <div 
             className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all gap-4 group min-h-[320px]"
          >
             <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors shadow-sm">
                <Plus className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400" />
             </div>
             <div className="text-center">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">New Database</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deploy a new instance</p>
             </div>
          </div>
       </div>
    </div>
  );
};