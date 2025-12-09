import * as React from 'react';
import { RefreshCw, Server, Shield, Key } from 'lucide-react';
import { Button, Badge } from '../../../components/ui';
import { EnhancedTable, ColumnDef } from '../../../components/ui/EnhancedTable';
import { useSupabaseSnmpDevices } from '../../../hooks/useSupabaseSnmpDevices';

export const SnmpDeviceTable = () => {
  const { data, loading, refetch } = useSupabaseSnmpDevices();

  const columns: ColumnDef<any>[] = [
    { 
       header: 'Device Name', 
       accessorKey: 'name',
       cell: (row) => (
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Server className="h-4 w-4" />
             </div>
             <span className="font-medium text-slate-900 dark:text-white">{row.name}</span>
          </div>
       )
    },
    { 
       header: 'Host / IP', 
       accessorKey: 'host',
       cell: (row) => (
          <div className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-black/20 px-2 py-1 rounded inline-block">
             {row.host}
          </div>
       )
    },
    { 
       header: 'Community String', 
       accessorKey: 'community_string',
       cell: (row) => (
          <div className="flex items-center gap-2 text-xs text-slate-500">
             <Key className="h-3 w-3" />
             <span className="blur-[2px] hover:blur-none transition-all cursor-pointer select-all">
                {row.community_string}
             </span>
          </div>
       )
    },
    {
        header: 'Status',
        accessorKey: 'id', // Dummy accessor
        cell: () => (
            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 dark:bg-white/5 dark:border-white/10">
                Monitoring
            </Badge>
        )
    }
  ];

  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between">
          <div>
             <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" /> 
                SNMP Device Registry
             </h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage connection details for network infrastructure.
             </p>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
             <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
             Refresh List
          </Button>
       </div>

       <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <EnhancedTable 
             data={data} 
             columns={columns} 
             searchKey="name"
             onEdit={(item) => console.log('Edit', item)}
             onDelete={(item) => console.log('Delete', item)}
          />
       </div>
    </div>
  );
};